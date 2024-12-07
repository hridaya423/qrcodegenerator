"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Download, 
  Palette, 
  Link, 
  Text, 
  QrCode, 
  Image as ImageIcon, 
  AlertTriangle 
} from 'lucide-react';

const DynamicChromePicker = dynamic(
  () => import('react-color').then((mod) => mod.ChromePicker),
  { ssr: false }
);
// components
export default function QRCodeGenerator() {
  const [hasMounted, setHasMounted] = useState(false);

  const [qrData, setQrData] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrSize, setQrSize] = useState(300);
  const [inputType, setInputType] = useState('text');
  const [imageUrl, setImageUrl] = useState('');
  const [showColorPickers, setShowColorPickers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  const validateInput = (input: string) => {
    if (!input) return false;
    
    if (inputType === 'text') {
      return input.trim().length > 0;
    }
    
    if (inputType === 'url' || inputType === 'image') {
      try {
        new URL(input);
        return true;
      } catch {
        return false;
      }
    }
    
    return false;
  };

  const downloadQRCode = () => {
    const svg = document.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e6eaf0] flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 backdrop-blur-[100px] opacity-50 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border border-white/30 backdrop-blur-xl bg-white/70 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-gray-800 p-6">
            <CardTitle className="flex items-center justify-center space-x-4 text-2xl font-semibold">
              <QrCode className="w-8 h-8 text-blue-600" />
              <span className="tracking-wide">QR Code Generator</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg flex items-center shadow-md">
                <AlertTriangle className="mr-3 w-6 h-6 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  onValueChange={(value) => {
                    setInputType(value);
                    setQrData('');
                    setImageUrl('');
                    setError(null);
                  }} 
                  value={inputType}
                >
                  <SelectTrigger className="w-full bg-gray-100/50 backdrop-blur-sm border border-gray-200/70">
                    <SelectValue placeholder="Select Input Type">
                      <div className="flex items-center">
                        {inputType === 'text' && <Text className="mr-2 text-blue-600" />}
                        {inputType === 'url' && <Link className="mr-2 text-green-600" />}
                        {inputType === 'image' && <ImageIcon className="mr-2 text-purple-600" />}
                        <span className="capitalize font-medium text-gray-700">{inputType}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl">
                    {['text', 'url', 'image'].map((type) => (
                      <SelectItem 
                        key={type} 
                        value={type} 
                        className="hover:bg-blue-50 focus:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center">
                          {type === 'text' && <Text className="mr-2 text-blue-600" />}
                          {type === 'url' && <Link className="mr-2 text-green-600" />}
                          {type === 'image' && <ImageIcon className="mr-2 text-purple-600" />}
                          <span className="capitalize">{type}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  onValueChange={(value) => setQrSize(Number(value))} 
                  value={qrSize.toString()}
                >
                  <SelectTrigger className="w-full bg-gray-100/50 backdrop-blur-sm border border-gray-200/70">
                    <SelectValue placeholder="QR Code Size">
                      {qrSize}x{qrSize} px
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl">
                    {[200, 300, 400, 500, 600].map((size) => (
                      <SelectItem 
                        key={size} 
                        value={size.toString()}
                        className="hover:bg-blue-50 focus:bg-blue-50 transition-colors"
                      >
                        {size}x{size} px
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input 
                placeholder={
                  inputType === 'text' 
                    ? 'Enter text' 
                    : inputType === 'url' 
                      ? 'Enter URL' 
                      : 'Enter Image URL'
                }
                value={inputType === 'image' ? imageUrl : qrData}
                onChange={(e) => {
                  const value = e.target.value;
                  if (inputType === 'image') {
                    setImageUrl(value);
                  } else {
                    setQrData(value);
                  }

                  if (!validateInput(value)) {
                    setError(`Invalid ${inputType} input`);
                  } else {
                    setError(null);
                  }
                }}
                className="w-full rounded-xl bg-gray-100/50 backdrop-blur-sm border border-gray-200/70 focus:border-blue-300 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 py-3 px-4"
              />

              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowColorPickers(!showColorPickers)}
                  className="flex items-center px-6 py-3 border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors duration-300 rounded-full"
                >
                  <Palette className="mr-2" /> Customize Colors
                </Button>
              </div>

              {showColorPickers && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">QR Code Color</p>
                    <div className="rounded-xl overflow-hidden shadow-md bg-white/70 backdrop-blur-sm">
                      <DynamicChromePicker 
                        color={qrColor}
                        onChange={(color) => setQrColor(color.hex)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Background Color</p>
                    <div className="rounded-xl overflow-hidden shadow-md bg-white/70 backdrop-blur-sm">
                      <DynamicChromePicker 
                        color={bgColor}
                        onChange={(color) => setBgColor(color.hex)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {qrData && !error && (
              <div className="flex flex-col items-center space-y-6">
                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl">
                  <QRCodeSVG 
                    value={qrData}
                    size={qrSize}
                    fgColor={qrColor}
                    bgColor={bgColor}
                    level={'H'}
                    imageSettings={imageUrl ? {
                      src: imageUrl,
                      height: qrSize / 4,
                      width: qrSize / 4,
                      excavate: true
                    } : undefined}
                  />
                </div>
                <Button 
                  onClick={downloadQRCode} 
                  className="px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 flex items-center text-lg shadow-xl"
                  disabled={!!error}
                >
                  <Download className="mr-3 w-6 h-6" /> Download QR Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}