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

export const projects: Project[] = [
    {
        slug: 'bathroom-renovation',
        src: '/images/bathroom/bathroom-01.webp',
        alt: 'Bathroom renovation project',
        subject: 'Bathroom Renovation',
        description: 'Full remodel with new tiling, fixtures, and a walk-in shower.',
        services: ['Plumbing', 'Carpentry', 'Painting', 'Tiling'],
        location: 'Franklin, TN',
        year: '2025',
        imageFolder: 'images/bathroom',
    },
    {
        slug: 'patio-renovation',
        src: '/images/porch/screened/porch-01.webp',
        alt: 'Patio renovation work',
        subject: 'Patio Renovation',
        description: 'Changing an outdated patio into a screened-in outdoor living space.',
        services: ['Carpentry', 'General Repairs'],
        location: 'Franklin, TN',
        year: '2025',
        imageFolder: 'images/porch/screened',
    },
    {
        slug: 'tongue-and-groove-ceiling',
        src: '/images/ceiling/tongueNgroove/tongueNgroove-04.webp',
        alt: 'Tongue and groove ceiling project',
        subject: 'Tongue and Groove Ceiling',
        description: 'Installation of a tongue and groove ceiling for a refined interior look.',
        services: ['Carpentry'],
        location: 'Franklin, TN',
        year: '2025',
        imageFolder: 'images/ceiling/tongueNgroove',
    },
     {
        slug: 'office-renovation',
        src: '/images/office/office-01.webp',
        alt: 'Office renovation project',
        subject: 'Office Renovation',
        description: 'Complete office makeover with modern design and functional layout.',
        services: ['Carpentry'],
        location: 'Franklin, TN',
        year: '2025',
        imageFolder: 'images/office',
    },
      {
        slug: 'coffered-ceiling',
        src: '/images/ceiling/coffered/coffered-01.webp',
        alt: 'Coffered ceiling project',
        subject: 'Coffered Ceiling',
        description: 'Installation of a coffered ceiling for an elegant interior touch.',
        services: ['Carpentry'],
        location: 'Franklin, TN',
        year: '2025',
        imageFolder: 'images/ceiling/coffered',
    },
];

