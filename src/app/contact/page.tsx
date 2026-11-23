import Contact from '@/app/components/Contact';
import { getAvailableServiceTitles } from '@/lib/mongodb';
import ServiceNav from '@/app/components/ServiceNav';

export const metadata = {
    title: 'Contact Handy Sam',
    description: 'Get a free quote from Handy Sam, your local handyman serving Franklin, TN and the surrounding area.',
};

export default async function ContactPage() {
    const availableServices = await getAvailableServiceTitles();

    return (
        <section className="contact-page">
            <ServiceNav />
            <Contact availableServices={availableServices} />
        </section>
    );
}
