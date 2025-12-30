import { useState, useRef } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  Icon,
  Progress,
  useToast,
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use local worker file
if (typeof window !== 'undefined' && pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

const FileUpload = ({ onFileProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const extractTextFromZip = async (file) => {
    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      
      // Find the first .txt file in the zip
      const txtFile = Object.keys(zipContent.files).find(filename => 
        filename.endsWith('.txt') && !filename.startsWith('__MACOSX')
      );

      if (!txtFile) {
        throw new Error('No .txt file found in the zip archive');
      }

      // Extract and read the text file
      const textContent = await zipContent.files[txtFile].async('text');
      return textContent;
    } catch (error) {
      throw new Error(`Failed to extract zip file: ${error.message}`);
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = '';

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Sort items by vertical position (y coordinate) to preserve layout
        const items = textContent.items.sort((a, b) => {
          // Sort by Y position first (top to bottom)
          const yDiff = Math.abs(b.transform[5] - a.transform[5]);
          if (yDiff > 5) { // If Y difference is significant (different lines)
            return b.transform[5] - a.transform[5];
          }
          // Same line, sort by X position (left to right)
          return a.transform[4] - b.transform[4];
        });

        // Group items by Y coordinate (same line)
        let currentY = null;
        let currentLine = [];
        const lines = [];

        items.forEach(item => {
          const y = Math.round(item.transform[5]);

          if (currentY === null || Math.abs(y - currentY) > 5) {
            // New line
            if (currentLine.length > 0) {
              lines.push(currentLine.join(' '));
            }
            currentLine = [item.str];
            currentY = y;
          } else {
            // Same line
            currentLine.push(item.str);
          }
        });

        // Add last line
        if (currentLine.length > 0) {
          lines.push(currentLine.join(' '));
        }

        // Join lines with newlines
        const pageText = lines.join('\n');
        fullText += pageText + '\n\n';
      }

      return fullText;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(`Failed to extract PDF: ${error.message}`);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isZip = file.name.endsWith('.zip');
    const isTxt = file.name.endsWith('.txt');
    const isJson = file.name.endsWith('.json');
    const isPdf = file.name.endsWith('.pdf');

    if (!isZip && !isTxt && !isJson && !isPdf) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a .txt, .json, .pdf, or .zip file from chat export',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setProgress(20);

    try {
      let content;
      let fileType = 'text'; // 'text' for .txt or .zip, 'json' for .json, 'pdf' for .pdf

      if (file.name.endsWith('.zip')) {
        // Handle zip file
        setProgress(30);
        content = await extractTextFromZip(file);
        setProgress(70);
        fileType = 'text';
      } else if (file.name.endsWith('.json')) {
        // Handle JSON file
        const reader = new FileReader();

        content = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            setProgress(50);
            resolve(e.target.result);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
        fileType = 'json';
        setProgress(70);
      } else if (file.name.endsWith('.pdf')) {
        // Handle PDF file
        setProgress(30);
        content = await extractTextFromPDF(file);
        setProgress(70);
        fileType = 'pdf';
      } else {
        // Handle regular txt file
        const reader = new FileReader();

        content = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            setProgress(50);
            resolve(e.target.result);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
        fileType = 'text';
      }

      setTimeout(() => {
        setProgress(100);
        onFileProcessed(content, fileType);

        toast({
          title: 'File processed successfully!',
          description: 'Your chat insights are ready',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        setIsProcessing(false);
      }, 500);
    } catch (error) {
      toast({
        title: 'Processing error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsProcessing(false);
    }
  };

  const MotionBox = motion(Box);
  const MotionIcon = motion(Icon);
  const MotionButton = motion(Button);

  return (
    <MotionBox
      borderWidth={3}
      borderStyle="dashed"
      borderColor="dark.300"
      borderRadius="2xl"
      p={{ base: 8, md: 12 }}
      textAlign="center"
      bg="white"
      cursor="pointer"
      onClick={() => !isProcessing && fileInputRef.current?.click()}
      position="relative"
      overflow="hidden"
      whileHover={{
        scale: 1.02,
        borderColor: '#5B21B6',
        boxShadow: '0 20px 60px -15px rgba(91, 33, 182, 0.4)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".txt,.json,.pdf,.zip"
        style={{ display: 'none' }}
      />

      <VStack spacing={{ base: 4, md: 5 }}>
        <MotionIcon
          as={FiUpload}
          boxSize={{ base: 12, md: 16 }}
          color="accent.600"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {isProcessing ? (
          <>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="dark.900">
              Analyzing {fileName}...
            </Text>
            <Progress
              value={progress}
              width="100%"
              maxW="400px"
              colorScheme="purple"
              borderRadius="full"
              hasStripe
              isAnimated
              size="lg"
            />
            <Text fontSize={{ base: "sm", md: "md" }} color="dark.600">
              Preparing your relationship insights
            </Text>
          </>
        ) : (
          <>
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="dark.900">
              Let's Begin
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} color="dark.600" maxW="400px">
              Upload your WhatsApp chat export to discover the story of your relationship
            </Text>
            <MotionButton
              bg="accent.600"
              color="white"
              size={{ base: "lg", md: "lg" }}
              leftIcon={<FiUpload />}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px -10px rgba(91, 33, 182, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              _hover={{ bg: 'accent.700' }}
              px={8}
              py={6}
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="bold"
            >
              Choose Your Chat File
            </MotionButton>
            <Text fontSize={{ base: "xs", md: "sm" }} color="dark.500" mt={{ base: 2, md: 3 }}>
              Need help? Export your chat as a .txt, .json, .pdf, or .zip file
            </Text>
          </>
        )}
      </VStack>
    </MotionBox>
  );
};

export default FileUpload;
