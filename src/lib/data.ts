export interface Service {
    title: string;
    description: string;
    icon: string;
    learnMoreLink?: string;
    value: string;
    features: string[];
}

export interface Project {
    slug: string;
    src: string;
    alt: string;
    subject: string;
    description: string;
    services: string[];
    location: string;
    year: string;
    imageFolder: string;
}
