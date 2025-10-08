'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';
import { bannerDisplayAPI } from '@/lib/api/bannerDisplayAPI';

interface Banner {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  priority: number;
}

interface BannerDisplayProps {
  position?: 'top' | 'middle' | 'bottom' | 'sidebar';
  className?: string;
  onBannerClick?: (banner: Banner) => void;
}

export function BannerDisplay({
  position = 'top',
  className = '',
  onBannerClick
}: BannerDisplayProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchBanners();
  }, [position]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerDisplayAPI.getActiveBanners(position);
      if (response.success) {
        setBanners(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = async (banner: Banner) => {
    try {
      // Track click for analytics
      await bannerDisplayAPI.trackClick(banner._id);

      // Call custom click handler if provided
      if (onBannerClick) {
        onBannerClick(banner);
      } else if (banner.linkUrl) {
        // Default behavior: open link in new tab
        window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error handling banner click:', error);
    }
  };

  const dismissBanner = (bannerId: string) => {
    setDismissedBanners(prev => new Set([...prev, bannerId]));
  };

  const nextBanner = useCallback(() => {
    setCurrentBannerIndex(prev => (prev < banners.length - 1 ? prev + 1 : 0));
  }, [banners.length]);

  const prevBanner = useCallback(() => {
    setCurrentBannerIndex(prev => (prev > 0 ? prev - 1 : banners.length - 1));
  }, [banners.length]);

  // Filter out dismissed banners
  const availableBanners = banners.filter(
    banner => !dismissedBanners.has(banner._id)
  );

  const currentBanner = availableBanners[currentBannerIndex];

  // Track impression when banner is displayed
  useEffect(() => {
    if (currentBanner) {
      bannerDisplayAPI.trackImpression(currentBanner._id);
    }
  }, [currentBanner]);

  // Auto-advance functionality for multiple banners
  useEffect(() => {
    if (availableBanners.length > 1) {
      const timer = setTimeout(() => {
        nextBanner();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [currentBannerIndex, availableBanners.length, nextBanner]);

  // Don't render if no banners or loading
  if (loading || availableBanners.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Banner Container */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm border border-white/20 shadow-2xl">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative p-6 md:p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                {currentBanner.title}
              </h3>
              <p className="text-blue-100 text-sm md:text-base line-clamp-3 mb-4">
                {currentBanner.description}
              </p>
              {currentBanner.linkUrl && (
                <Button
                  onClick={() => handleBannerClick(currentBanner)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300"
                  size="sm">
                  Learn More
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Dismiss Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissBanner(currentBanner._id)}
              className="text-white/70 hover:text-white hover:bg-white/20 p-1 h-auto">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Dots (if multiple banners) */}
        {availableBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {availableBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentBannerIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Auto-advance timer (if multiple banners) */}
        {availableBanners.length > 1 && (
          <div className="absolute bottom-0 left-0 h-1 bg-white/30">
            <div
              className="h-full bg-white transition-all duration-5000 ease-linear"
              style={{
                width: '100%',
                animation: 'bannerProgress 10s linear infinite'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// CSS for banner progress animation
const bannerProgressCSS = `
  @keyframes bannerProgress {
    from { width: 0%; }
    to { width: 100%; }
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = bannerProgressCSS;
  document.head.appendChild(style);
}
