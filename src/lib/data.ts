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

export const services: Service[] = [
    {
        title: 'Plumbing',
        description: 'Fix leaks, replace fixtures, toilet installation, garbage disposal installation, and more.',
        learnMoreLink: '/services/plumbing',
        icon: '🔧',
        value: 'plumbing',
        features: ['Small Jobs','Weekend'],
    },
    {
        title: 'General Repairs',
        description: 'Reliable repairs and maintenance for every corner of your home.',
        learnMoreLink: '/services/general-repairs',
        icon: '🛠️',
        value: 'general-repairs',
        features: ['Handyman'],
    },
    {
        title: 'Electrical',
        description: 'Replace outlets,fixtures, ceiling fans, and more.',
        learnMoreLink: '/services/electrical',
        icon: '💡',
        value: 'electrical',
        features: ['Weekend'],
    },
    {
        title: 'Carpentry',
        description: 'Flooring installation, cabinetry, framing, custom woodwork.',
        learnMoreLink: '/services/carpentry',
        icon: '🪚',
        value: 'carpentry',
        features: ['Weekend'],
    },
    {
        title: 'Painting & Finishing',
        description: 'Room paint jobs, trim work, and flawless interior & exterior finishes.',
        learnMoreLink: '/services/painting',
        icon: '🖌️',
        value: 'painting',
        features: ['Weekend'],
    }, 
    {
        title: 'Hauling',
        description: 'Removal of debris, old furniture, and other unwanted items.',
        learnMoreLink: '/services/hauling',
        icon: '🚛',
        value: 'hauling',
        features: ['Weekend'],
    },
];

export const availableServices = services
    .map(service => service.title)
    .sort((a, b) => a.localeCompare(b));

export const projects: Project[] = [
    {
        slug: 'bathroom-renovation',
        src: '/images/bathroom/bathroom-01.jpg',
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
        src: '/images/porch/screened/porch-01.jpg',
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
        src: '/images/ceiling/tongueNgroove/tongueNgroove-04.jpg',
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
        src: '/images/office/office-01.jpg',
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
        src: '/images/ceiling/coffered/coffered-01.jpg',
        alt: 'Coffered ceiling project',
        subject: 'Coffered Ceiling',
        description: 'Installation of a coffered ceiling for an elegant interior touch.',
        services: ['Carpentry'],
        location: 'Franklin, TN',
        year: '2025',
        imageFolder: 'images/ceiling/coffered',
    },
];

