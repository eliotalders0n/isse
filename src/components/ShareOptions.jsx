import { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Image,
  SimpleGrid,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiShare2,
  FiDownload,
  FiLink,
  FiTwitter,
  FiFacebook,
} from 'react-icons/fi';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';

const ShareOptions = ({ summaryRef, metadata, sentiment }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();
  const MotionButton = motion(Button);
  const MotionBox = motion(Box);

  // Generate shareable image
  const generateImage = async () => {
    if (!summaryRef?.current) return null;

    try {
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      return canvas;
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return null;
    }
  };

  // Download summary as image
  const handleDownload = async () => {
    setIsGenerating(true);
    const canvas = await generateImage();
    if (canvas) {
      const link = document.createElement('a');
      link.download = `relationship-summary-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: 'Success',
        description: 'Summary downloaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    setIsGenerating(false);
  };

  // Generate QR code
  const handleGenerateQR = async () => {
    setIsGenerating(true);
    onOpen();

    try {
      const shareData = {
        participants: metadata.participants.join(' & '),
        sentiment: sentiment.overallSentiment,
        health: sentiment.communicationHealth,
        messages: metadata.totalMessages,
        days: sentiment.totalDays,
      };

      const shareUrl = `${window.location.origin}?shared=${encodeURIComponent(
        JSON.stringify(shareData)
      )}`;

      const qrUrl = await QRCode.toDataURL(shareUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#319795',
          light: '#ffffff',
        },
      });

      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setIsGenerating(false);
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    const shareData = {
      participants: metadata.participants.join(' & '),
      sentiment: sentiment.overallSentiment,
      health: sentiment.communicationHealth,
      messages: metadata.totalMessages,
      days: sentiment.totalDays,
    };

    const shareUrl = `${window.location.origin}?shared=${encodeURIComponent(
      JSON.stringify(shareData)
    )}`;

    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Link copied',
      description: 'Share link copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Share to social media
  const handleSocialShare = async (platform) => {
    const text = `Just analyzed my WhatsApp conversation! ${sentiment.totalDays} days, ${metadata.totalMessages} messages, ${sentiment.overallSentiment} sentiment!`;

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.origin
        )}&quote=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Native share API
  const handleNativeShare = async () => {
    const canvas = await generateImage();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'relationship-summary.png', {
        type: 'image/png',
      });

      const shareData = {
        title: 'My Relationship Analysis',
        text: `Check out my WhatsApp conversation analysis: ${sentiment.totalDays} days, ${metadata.totalMessages} messages!`,
        files: [file],
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          toast({
            title: 'Shared successfully',
            status: 'success',
            duration: 2000,
          });
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Error sharing:', error);
          }
        }
      } else {
        // Fallback to download
        handleDownload();
      }
    });
  };

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <VStack spacing={4} align="stretch">
          <Text fontSize="sm" fontWeight="bold" color="purple.800">
            Share Your Analysis
          </Text>

          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
            <Tooltip label="Download as image">
              <MotionButton
                leftIcon={<FiDownload />}
                colorScheme="teal"
                variant="outline"
                size="sm"
                onClick={handleDownload}
                isLoading={isGenerating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download
              </MotionButton>
            </Tooltip>

            <Tooltip label="Generate QR code">
              <MotionButton
                leftIcon={<FiShare2 />}
                colorScheme="purple"
                variant="outline"
                size="sm"
                onClick={handleGenerateQR}
                isLoading={isGenerating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                QR Code
              </MotionButton>
            </Tooltip>

            <Tooltip label="Copy share link">
              <MotionButton
                leftIcon={<FiLink />}
                colorScheme="blue"
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Copy Link
              </MotionButton>
            </Tooltip>

            <Tooltip label="Share via apps">
              <MotionButton
                leftIcon={<FiShare2 />}
                colorScheme="green"
                variant="outline"
                size="sm"
                onClick={handleNativeShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share
              </MotionButton>
            </Tooltip>
          </SimpleGrid>

          <Box>
            <Text fontSize="xs" color="gray.600" mb={2}>
              Share on social media:
            </Text>
            <HStack spacing={2}>
              <Tooltip label="Share on Twitter">
                <IconButton
                  icon={<FiTwitter />}
                  size="sm"
                  colorScheme="twitter"
                  variant="ghost"
                  onClick={() => handleSocialShare('twitter')}
                  aria-label="Share on Twitter"
                />
              </Tooltip>
              <Tooltip label="Share on Facebook">
                <IconButton
                  icon={<FiFacebook />}
                  size="sm"
                  colorScheme="facebook"
                  variant="ghost"
                  onClick={() => handleSocialShare('facebook')}
                  aria-label="Share on Facebook"
                />
              </Tooltip>
              <Tooltip label="Share on WhatsApp">
                <IconButton
                  icon={<FiShare2 />}
                  size="sm"
                  colorScheme="whatsapp"
                  variant="ghost"
                  onClick={() => handleSocialShare('whatsapp')}
                  aria-label="Share on WhatsApp"
                />
              </Tooltip>
            </HStack>
          </Box>
        </VStack>
      </MotionBox>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share with QR Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              {qrCodeUrl && (
                <Image src={qrCodeUrl} alt="QR Code" maxW="300px" />
              )}
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Scan this QR code to view a summary of your relationship analysis
              </Text>
              <Button
                leftIcon={<FiDownload />}
                colorScheme="teal"
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = `qr-code-${Date.now()}.png`;
                  link.href = qrCodeUrl;
                  link.click();
                  toast({
                    title: 'QR Code downloaded',
                    status: 'success',
                    duration: 2000,
                  });
                }}
              >
                Download QR Code
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareOptions;
