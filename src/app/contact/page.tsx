import Contact from '@/app/components/Contact';

export const metadata = {
    title: 'Contact Handy Sam',
    description: 'Get a free quote from Handy Sam, your local handyman serving Franklin, TN and the surrounding area.',
};

export default function ContactPage() {
    return (
        <section className="contact-page">
            <Contact />
        </section>
    );
}
