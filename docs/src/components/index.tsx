import Link from 'next/link';
import Head from 'next/head';
import { Tabs } from './tabs';
import { useState } from 'react';
import { SliderExamples } from './slider/slider-examples';
import { TABS, TabId } from './slider/tabs-config';

const title = 'React Native Awesome Slider';
const description =
  'A versatile, responsive react native abd web Slider component.';
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slider.0xalt.xyz/';
const ogImage = `${baseUrl}/og-image.png`;

export const IndexPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>(TABS[1].id);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="keywords"
          content="React Native, Slider, Reanimated, Gesture Handler"
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Head>
      <div className="flex flex-col items-center justify-center relative overflow-hidden min-h-screen bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#0A0A0A_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A]" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-4">
            React Native Awesome Slider
          </h1>
          <p className="text-md md:text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            {`A versatile, responsive <Slider /> component, interactive with it.`}
          </p>

          <div className="w-full max-w-md mx-auto flex flex-col justify-center items-center min-h-[290px] mb-12 relative">
            <div className="absolute inset-0 bg-[#0A0A0A]/70 rounded-xl border border-[#222222] shadow-2xl overflow-hidden backdrop-blur-[2px]" />

            <div className="relative w-full p-8">
              <div className="w-full max-w-md mb-6">
                <Tabs
                  tabs={TABS}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
              </div>

              <SliderExamples activeTab={activeTab} />
            </div>
          </div>

          <Link
            href="/docs"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-full hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            Documentation
          </Link>
        </div>
      </div>
    </>
  );
};
