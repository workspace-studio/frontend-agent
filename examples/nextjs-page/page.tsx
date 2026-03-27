import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import Layout from '@/components/Layout';
import { buildMetadata } from '@/utils/static/buildMetadata';
import HeroSection from '@/views/Home/HeroSection';
import FeaturesSection from '@/views/Home/FeaturesSection';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.metadata.home');

  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: t('path'),
  });
}

const HomePage = () => {
  const t = useTranslations('home');

  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
    </Layout>
  );
};

export default HomePage;
