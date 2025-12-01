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

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isZip = file.name.endsWith('.zip');
    const isTxt = file.name.endsWith('.txt');

    if (!isZip && !isTxt) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a .txt or .zip file from WhatsApp export',
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

      if (file.name.endsWith('.zip')) {
        // Handle zip file
        setProgress(30);
        content = await extractTextFromZip(file);
        setProgress(70);
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
      }

      setTimeout(() => {
        setProgress(100);
        onFileProcessed(content);

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
      borderColor="warm.300"
      borderRadius="2xl"
      p={{ base: 8, md: 12 }}
      textAlign="center"
      bg="warm.50"
      cursor="pointer"
      onClick={() => !isProcessing && fileInputRef.current?.click()}
      position="relative"
      overflow="hidden"
      whileHover={{
        scale: 1.02,
        borderColor: '#FF8556',
        boxShadow: '0 20px 60px -15px rgba(255, 133, 86, 0.4)',
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
        accept=".txt,.zip"
        style={{ display: 'none' }}
      />

      <VStack spacing={{ base: 4, md: 5 }}>
        <MotionIcon
          as={FiUpload}
          boxSize={{ base: 12, md: 16 }}
          color="warm.500"
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
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="sand.800">
              Analyzing {fileName}...
            </Text>
            <Progress
              value={progress}
              width="100%"
              maxW="400px"
              colorScheme="warm"
              borderRadius="full"
              hasStripe
              isAnimated
              size="lg"
            />
            <Text fontSize={{ base: "sm", md: "md" }} color="sand.600">
              Preparing your relationship insights
            </Text>
          </>
        ) : (
          <>
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="sand.800">
              Let's Begin
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} color="sand.600" maxW="400px">
              Upload your WhatsApp chat export to discover the story of your relationship
            </Text>
            <MotionButton
              bg="warm.500"
              color="white"
              size={{ base: "lg", md: "lg" }}
              leftIcon={<FiUpload />}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px -10px rgba(255, 133, 86, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              _hover={{ bg: 'warm.600' }}
              px={8}
              py={6}
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="bold"
            >
              Choose Your Chat File
            </MotionButton>
            <Text fontSize={{ base: "xs", md: "sm" }} color="sand.500" mt={{ base: 2, md: 3 }}>
              Need help? Export your WhatsApp chat without media as a .txt or .zip file
            </Text>
          </>
        )}
      </VStack>
    </MotionBox>
  );
};

export default FileUpload;
