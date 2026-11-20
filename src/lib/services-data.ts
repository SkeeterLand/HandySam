export interface ServiceContent {
    value: string;
    title: string;
    tagline: string;
    heroTitle: string;
    heroHighlight: string;
    heroDescription: string;
    heroFooter: string;
    benefitsTitle: string;
    benefits: Array<{
        icon: string;
        title: string;
        description: string;
    }>;
    scopeTitle: string;
    scopeItems: Array<{ label: string; items: string }>;
    scopeFooter: string;
    askTitle: string;
    askSubtitle: string;
    askDescription: string;
    processTitle: string;
    processSteps: Array<{ title: string; description: string }>;
    faqTitle: string;
    faqs: Array<{ question: string; answer: string }>;
    ctaTitle: string;
    ctaDescription: string;
}

export const servicesData: Record<string, ServiceContent> = {
    carpentry: {
        value: 'carpentry',
        title: 'Carpentry',
        tagline: 'Trim · Rot Repair · Custom Woodwork · Franklin, TN',
        heroTitle: 'Small Carpentry Jobs, Done Right',
        heroHighlight: 'Done Right',
        heroDescription:
            'Most contractors won’t take the small stuff — a rotten sill, a crooked door, a trim run that never got finished. That’s exactly what I do. Clean cuts, tight joints, and wood that lasts.',
        heroFooter: 'Local · Owner-operated · Free estimates · No job too small',
        benefitsTitle: 'Why homeowners call me for the small jobs',
        benefits: [
            {
                icon: '📐',
                title: 'Clean cuts, tight joints',
                description:
                    'Trim that meets flush, miters that actually line up, and caulk lines you can’t see. The details are the whole job.',
            },
            {
                icon: '🪵',
                title: 'Rot repaired, not covered up',
                description:
                    'I cut out the bad wood, treat or replace what’s behind it, and rebuild it so water stays out — not just paint over it.',
            },
            {
                icon: '🚪',
                title: 'Doors and windows that work',
                description:
                    'Sticking doors, drafts, loose trim, failed seals — fixed properly so they close right and stop leaking air.',
            },
            {
                icon: '🧰',
                title: 'No job too small',
                description:
                    'One shelf, one door, one piece of trim — I show up for the jobs the big crews won’t bid on.',
            },
        ],
        scopeTitle: 'What I take on',
        scopeItems: [
            {
                label: 'Trim & finish work:',
                items: 'baseboards, crown, casing, window & door trim',
            },
            {
                label: 'Rot repair:',
                items: 'sills, fascia, thresholds, exterior trim, deck boards',
            },
            {
                label: 'Doors & windows:',
                items: 'hanging, adjusting, re-casing, weather sealing',
            },
            {
                label: 'Custom wood projects:',
                items: 'shelves, mantels, built-ins, small furniture repairs',
            },
            {
                label: 'Punch-list carpentry:',
                items: 'the small fixes that never got finished',
            },
        ],
        scopeFooter:
            'Not sure if your project is in scope? Ask — I’ll tell you honestly and refer you to the right pro if it’s a bigger structural job.',
        askTitle: "Don't see your project?",
        askSubtitle: "If it's made of wood, just ask.",
        askDescription:
            'The list above covers the most common jobs, but it’s not everything. I take on plenty of one-off wood projects — a weird shelf, a damaged cabinet door, a custom piece, a repair nobody else wants to touch. If you’re not sure whether it’s something I do, ask anyway. Worst case, I point you to the right person.',
        processTitle: 'How it works',
        processSteps: [
            {
                title: 'Free walkthrough',
                description:
                    'I come to you, look at the job, and talk through options.',
            },
            {
                title: 'Clear written quote',
                description:
                    'Flat price, line-item scope, no hidden fees. You decide.',
            },
            {
                title: 'Repair & build',
                description:
                    'Bad wood cut out, surfaces prepped, new work fitted tight.',
            },
            {
                title: 'Walkthrough & cleanup',
                description:
                    'We review the work together. I don’t leave until it’s right.',
            },
        ],
        faqTitle: 'Common questions',
        faqs: [
            {
                question: 'Do you take on small jobs?',
                answer:
                    'Yes — that’s most of what I do. One door, one trim run, one rotten sill. If it’s a real carpentry job, I’ll quote it.',
            },
            {
                question: 'Can you match existing trim?',
                answer:
                    'In most cases, yes. I’ll match profile, size, and material as closely as possible, and paint or stain to blend in.',
            },
            {
                question: 'How do you handle rotten wood?',
                answer:
                    'I cut out the damaged section, check what’s behind it, treat or replace as needed, then rebuild so water stays out. I don’t just cover it with filler and paint.',
            },
            {
                question: 'Do you do structural work?',
                answer:
                    'No — I stick to finish carpentry, trim, rot repair, and small wood projects. If a job needs structural or engineering work, I’ll refer you to a licensed pro.',
            },
            {
                question: 'Do you supply the materials?',
                answer:
                    'I can source trim, lumber, and hardware at cost, or work with materials you’ve already bought. We’ll decide at the quote.',
            },
        ],
        ctaTitle: "Got a small job that’s been sitting on the list?",
        ctaDescription:
            'Free estimate, no pressure, no sales pitch. Just an honest quote.',
    },
    painting: {
        value: 'painting',
        title: 'Painting & Finishing',
        tagline: 'Interior & Exterior Painting · Franklin, TN',
        heroTitle: 'A Clean, Professional Paint Job — Without the Headache',
        heroHighlight: 'Without the Headache',
        heroDescription:
            'Most paint jobs fail in the prep. I take the time to do it right — patched, sanded, taped, and primed — so the finish looks sharp for years, not months.',
        heroFooter: 'Local · Owner-operated · Free estimates · Weekend availability',
        benefitsTitle: 'What you get when you hire me',
        benefits: [
            {
                icon: '🛠️',
                title: 'Real prep work',
                description:
                    'Patched drywall, sanded edges, caulked trim, and primed surfaces. The boring stuff most painters skip is the reason mine lasts.',
            },
            {
                icon: '🎨',
                title: 'Paint that’s right for the room',
                description:
                    'I’ll help you pick the right sheen and product for kitchens, baths, trim, and exteriors — no guesswork, no wasted money.',
            },
            {
                icon: '🧹',
                title: 'Cleaner than I found it',
                description:
                    'Furniture covered, floors protected, daily cleanup. You come home to a finished room, not a construction site.',
            },
            {
                icon: '⏱️',
                title: 'Honest timelines',
                description:
                    'Most rooms done in 1–2 days. No vanishing acts, no surprise delays, no “I’ll be back next week” that never happens.',
            },
        ],
        scopeTitle: 'What I paint',
        scopeItems: [
            {
                label: 'Interior:',
                items: 'walls, ceilings, trim, doors, baseboards, cabinets',
            },
            {
                label: 'Exterior:',
                items: 'siding, trim, doors, shutters, small decks & porches',
            },
            {
                label: 'Finishing:',
                items: 'touch-ups, accent walls, color matching',
            },
        ],
        scopeFooter:
            'Not sure if your project is in scope? Ask — I’ll tell you honestly and refer you to a licensed pro if it’s not.',
        askTitle: "Don't see your project?",
        askSubtitle: 'If it needs paint, just ask.',
        askDescription:
            'The list above covers the most common jobs, but it’s not everything. I take on plenty of one-off painting projects — a single cabinet, a garage door, a rental touch-up, a color you can’t quite match, a surface nobody else wants to deal with. If you’re not sure whether it’s something I do, ask anyway. Worst case, I point you to the right person.',
        processTitle: 'How it works',
        processSteps: [
            {
                title: 'Free walkthrough',
                description:
                    'I come to you, take measurements, and talk through your goals.',
            },
            {
                title: 'Clear written quote',
                description:
                    'Flat price, line-item scope, no hidden fees. You decide.',
            },
            {
                title: 'Prep & paint',
                description:
                    'Furniture covered, surfaces prepped, paint applied right.',
            },
            {
                title: 'Walkthrough & cleanup',
                description:
                    'We review the work together. I don’t leave until it’s right.',
            },
        ],
        faqTitle: 'Common questions',
        faqs: [
            {
                question: 'Do I need to move furniture?',
                answer:
                    'No — I’ll move and cover what I can. Anything fragile or heavy, we’ll agree on a plan before I start.',
            },
            {
                question: 'Do you provide the paint?',
                answer:
                    'I can supply paint at cost, or you can choose your own. I’ll recommend the right product for your room and budget.',
            },
            {
                question: 'How long does a room take?',
                answer:
                    'Most standard rooms are 1–2 days, depending on prep and drying time. I’ll give you a realistic estimate up front.',
            },
            {
                question: 'Are you licensed and insured?',
                answer:
                    "I’m a local owner-operator and carry liability coverage. For anything requiring an electrical or plumbing license, I refer you to a licensed pro — I won’t fake it.",
            },
            {
                question: 'Do you supply the materials?',
                answer:
                    'I can source trim, lumber, and hardware at cost, or work with materials you’ve already bought. We’ll decide at the quote.',
            },
        ],
        ctaTitle: 'Ready for a room that looks like it should?',
        ctaDescription:
            'Free estimate, no pressure, no sales pitch. Just an honest quote.',
    },
    plumbing: {
        value: 'plumbing',
        title: 'Plumbing',
        tagline: 'Leaks, Fixtures & Toilets · Franklin, TN',
        heroTitle: 'Plumbing Problems, Fixed Fast',
        heroHighlight: 'Fixed Fast',
        heroDescription:
            'Leaky faucet, running toilet, or a garbage disposal that quit? I handle the small plumbing jobs most people put off — cleanly, honestly, and without the big-company markup.',
        heroFooter: 'Local · Owner-operated · Free estimates · Weekend availability',
        benefitsTitle: 'Why homeowners call me for plumbing',
        benefits: [
            {
                icon: '🔧',
                title: 'Leaks fixed, not just patched',
                description:
                    'I find the source of the leak and fix it properly — not just tighten a fitting and hope for the best.',
            },
            {
                icon: '🚽',
                title: 'Toilets that actually flush',
                description:
                    'Running, clogged, or leaking at the base — I’ll get it working right or tell you if it’s time to replace.',
            },
            {
                icon: '🚰',
                title: 'Fixtures & disposals',
                description:
                    'New faucet, showerhead, or garbage disposal installed the right way, with no leaks and no guesswork.',
            },
            {
                icon: '🧰',
                title: 'No job too small',
                description:
                    'One leaky shut-off valve or one dripping spigot — I show up for the jobs the big crews won’t bid on.',
            },
        ],
        scopeTitle: 'What I take on',
        scopeItems: [
            {
                label: 'Leak repair:',
                items: 'faucets, pipes, shut-off valves, outdoor spigots',
            },
            {
                label: 'Toilets:',
                items: 'running, clogged, leaking, replacement',
            },
            {
                label: 'Fixtures:',
                items: 'faucets, showerheads, garbage disposals',
            },
        ],
        scopeFooter:
            'Not sure if your project is in scope? Ask — I’ll tell you honestly and refer you to a licensed plumber if it’s bigger than a small job.',
        askTitle: "Don't see your project?",
        askSubtitle: 'If it involves water, just ask.',
        askDescription:
            'The list covers the most common plumbing jobs, but it’s not everything. If you’re not sure whether it’s something I do, ask anyway — worst case, I point you to the right person.',
        processTitle: 'How it works',
        processSteps: [
            {
                title: 'Free walkthrough',
                description:
                    'I come to you, look at the job, and talk through options.',
            },
            {
                title: 'Clear written quote',
                description:
                    'Flat price, line-item scope, no hidden fees. You decide.',
            },
            {
                title: 'Repair & install',
                description:
                    'Problem fixed, fixtures installed, everything tested before I leave.',
            },
            {
                title: 'Walkthrough & cleanup',
                description:
                    'We review the work together. I don’t leave until it’s right.',
            },
        ],
        faqTitle: 'Common questions',
        faqs: [
            {
                question: 'Do you take on small plumbing jobs?',
                answer:
                    'Yes — that’s most of what I do. One leaky faucet, one running toilet, one garbage disposal. If it’s a real plumbing job, I’ll quote it.',
            },
            {
                question: 'Can you install a new faucet or disposal?',
                answer:
                    'Yes — I install faucets, showerheads, and garbage disposals properly, with no leaks and no guesswork.',
            },
            {
                question: 'Are you a licensed plumber?',
                answer:
                    'No — I’m a local owner-operator who handles small plumbing repairs and installations. If a job needs a licensed plumber, I’ll refer you to one.',
            },
        ],
        ctaTitle: 'Got a leak that’s been driving you crazy?',
        ctaDescription:
            'Free estimate, no pressure, no sales pitch. Just an honest quote.',
    },
    electrical: {
        value: 'electrical',
        title: 'Electrical',
        tagline: 'Outlets, Fixtures & Ceiling Fans · Franklin, TN',
        heroTitle: 'Electrical Work Done Safely',
        heroHighlight: 'Done Safely',
        heroDescription:
            'Dead outlet, flickering light, or a ceiling fan that never got installed? I handle small electrical jobs safely and correctly — no shortcuts, no surprises.',
        heroFooter: 'Local · Owner-operated · Free estimates · Weekend availability',
        benefitsTitle: 'Why homeowners call me for electrical',
        benefits: [
            {
                icon: '💡',
                title: 'Safe, code-conscious work',
                description:
                    'I work carefully and follow good electrical practice. If a job needs a licensed electrician, I’ll say so.',
            },
            {
                icon: '🔌',
                title: 'Outlets & switches fixed',
                description:
                    'Dead outlets, loose switches, and faulty wiring — diagnosed and fixed properly.',
            },
            {
                icon: '🌀',
                title: 'Ceiling fans & light fixtures',
                description:
                    'New fan or light fixture installed securely and wired correctly.',
            },
            {
                icon: '🧰',
                title: 'No job too small',
                description:
                    'One outlet, one switch, one fixture — I show up for the jobs the big crews won’t bid on.',
            },
        ],
        scopeTitle: 'What I take on',
        scopeItems: [
            {
                label: 'Outlets & switches:',
                items: 'replacement, repair, new installation',
            },
            {
                label: 'Lighting:',
                items: 'ceiling fans, light fixtures, switches',
            },
            {
                label: 'Electrical repairs:',
                items: 'dead outlets, flickering lights, faulty switches',
            },
        ],
        scopeFooter:
            'Not sure if your project is in scope? Ask — I’ll tell you honestly and refer you to a licensed electrician if it needs one.',
        askTitle: "Don't see your project?",
        askSubtitle: 'If it involves electricity, just ask.',
        askDescription:
            'The list covers the most common small electrical jobs, but it’s not everything. If you’re not sure whether it’s something I do, ask anyway — worst case, I point you to the right person.',
        processTitle: 'How it works',
        processSteps: [
            {
                title: 'Free walkthrough',
                description:
                    'I come to you, look at the job, and talk through options.',
            },
            {
                title: 'Clear written quote',
                description:
                    'Flat price, line-item scope, no hidden fees. You decide.',
            },
            {
                title: 'Repair & install',
                description:
                    'Problem fixed, fixture installed, everything tested before I leave.',
            },
            {
                title: 'Walkthrough & cleanup',
                description:
                    'We review the work together. I don’t leave until it’s right.',
            },
        ],
        faqTitle: 'Common questions',
        faqs: [
            {
                question: 'Do you take on small electrical jobs?',
                answer:
                    'Yes — outlets, switches, light fixtures, ceiling fans. If it’s a real electrical job, I’ll quote it.',
            },
            {
                question: 'Are you a licensed electrician?',
                answer:
                    'No — I’m a local owner-operator who handles small electrical repairs and installations. If a job needs a licensed electrician, I’ll refer you to one.',
            },
            {
                question: 'Can you install a ceiling fan?',
                answer:
                    'Yes — I install ceiling fans and light fixtures securely and wired correctly.',
            },
        ],
        ctaTitle: 'Got an outlet or light that’s not working?',
        ctaDescription:
            'Free estimate, no pressure, no sales pitch. Just an honest quote.',
    },
    'general-repairs': {
        value: 'general-repairs',
        title: 'General Repairs',
        tagline: 'Home Repairs & Maintenance · Franklin, TN',
        heroTitle: 'Reliable Repairs for Every Corner of Your Home',
        heroHighlight: 'Every Corner of Your Home',
        heroDescription:
            'Sticking door, loose handrail, wobbly shelf — the small repairs that add up. I take care of them properly so you don’t have to live with them.',
        heroFooter: 'Local · Owner-operated · Free estimates · Weekend availability',
        benefitsTitle: 'Why homeowners call me for general repairs',
        benefits: [
            {
                icon: '🛠️',
                title: 'The small stuff, done right',
                description:
                    'Doors, windows, shelves, handrails — all the little fixes that make your home feel solid again.',
            },
            {
                icon: '🏠',
                title: 'Maintenance you’ve been putting off',
                description:
                    'Weather stripping, caulking, touch-up paint, and all the upkeep that keeps your home in good shape.',
            },
            {
                icon: '🧰',
                title: 'No job too small',
                description:
                    'One door adjustment or one loose handrail — I show up for the jobs the big crews won’t bid on.',
            },
        ],
        scopeTitle: 'What I take on',
        scopeItems: [
            {
                label: 'Doors & windows:',
                items: 'sticking doors, loose hardware, weather stripping',
            },
            {
                label: 'Shelves & handrails:',
                items: 'installation, repair, secure mounting',
            },
            {
                label: 'Home maintenance:',
                items: 'caulking, touch-up paint, minor drywall repair',
            },
        ],
        scopeFooter:
            'Not sure if your project is in scope? Ask — I’ll tell you honestly and refer you to the right pro if needed.',
        askTitle: "Don't see your project?",
        askSubtitle: 'If it needs fixing, just ask.',
        askDescription:
            'The list covers the most common repair jobs, but it’s not everything. If you’re not sure whether it’s something I do, ask anyway — worst case, I point you to the right person.',
        processTitle: 'How it works',
        processSteps: [
            {
                title: 'Free walkthrough',
                description:
                    'I come to you, look at the job, and talk through options.',
            },
            {
                title: 'Clear written quote',
                description:
                    'Flat price, line-item scope, no hidden fees. You decide.',
            },
            {
                title: 'Repair & fix',
                description:
                    'Problem fixed properly, everything tested before I leave.',
            },
            {
                title: 'Walkthrough & cleanup',
                description:
                    'We review the work together. I don’t leave until it’s right.',
            },
        ],
        faqTitle: 'Common questions',
        faqs: [
            {
                question: 'Do you take on small repair jobs?',
                answer:
                    'Yes — doors, windows, shelves, handrails, and all the little fixes around your home.',
            },
            {
                question: 'Can you install shelves or handrails?',
                answer:
                    'Yes — I mount them securely so they’re safe and solid.',
            },
            {
                question: 'Are you licensed?',
                answer:
                    'I’m a local owner-operator who handles small home repairs. If a job needs a licensed trade, I’ll refer you to one.',
            },
        ],
        ctaTitle: 'Got a repair that’s been sitting on the list?',
        ctaDescription:
            'Free estimate, no pressure, no sales pitch. Just an honest quote.',
    },
    hauling: {
        value: 'hauling',
        title: 'Hauling',
        tagline: 'Debris Removal & Junk Hauling · Franklin, TN',
        heroTitle: 'Debris Removed, Space Reclaimed',
        heroHighlight: 'Space Reclaimed',
        heroDescription:
            'Old furniture, construction debris, yard waste, or just junk that’s been sitting too long? I haul it away so you don’t have to deal with it.',
        heroFooter: 'Local · Owner-operated · Free estimates · Weekend availability',
        benefitsTitle: 'Why homeowners call me for hauling',
        benefits: [
            {
                icon: '🚛',
                title: 'Junk and debris removed',
                description:
                    'Old furniture, appliances, construction debris, yard waste — loaded up and taken away.',
            },
            {
                icon: '🧹',
                title: 'Clean sweep after',
                description:
                    'I don’t just dump and run — the area is left clean when I’m done.',
            },
            {
                icon: '🧰',
                title: 'No job too small',
                description:
                    'One couch or one truckload — I show up for the jobs the big crews won’t bid on.',
            },
        ],
        scopeTitle: 'What I take on',
        scopeItems: [
            {
                label: 'Junk removal:',
                items: 'old furniture, appliances, household junk',
            },
            {
                label: 'Debris hauling:',
                items: 'construction debris, yard waste, renovation leftovers',
            },
            {
                label: 'Cleanout:',
                items: 'garages, basements, attics, sheds',
            },
        ],
        scopeFooter:
            'Not sure if your project is in scope? Ask — I’ll tell you honestly and refer you to the right service if needed.',
        askTitle: "Don't see your project?",
        askSubtitle: 'If it needs hauling, just ask.',
        askDescription:
            'The list covers the most common hauling jobs, but it’s not everything. If you’re not sure whether it’s something I do, ask anyway — worst case, I point you to the right person.',
        processTitle: 'How it works',
        processSteps: [
            {
                title: 'Free walkthrough',
                description:
                    'I come to you, look at what needs to go, and talk through options.',
            },
            {
                title: 'Clear written quote',
                description:
                    'Flat price based on volume, no hidden fees. You decide.',
            },
            {
                title: 'Load & haul',
                description:
                    'Everything loaded up and hauled away properly.',
            },
            {
                title: 'Clean sweep',
                description:
                    'Area left clean when I’m done.',
            },
        ],
        faqTitle: 'Common questions',
        faqs: [
            {
                question: 'Do you take on small hauling jobs?',
                answer:
                    'Yes — one couch, one truckload, or a full cleanout. If it needs hauling, I’ll quote it.',
            },
            {
                question: 'What do you haul?',
                answer:
                    'Old furniture, appliances, construction debris, yard waste, and household junk.',
            },
            {
                question: 'Do you clean up after?',
                answer:
                    'Yes — I leave the area clean when I’m done.',
            },
        ],
        ctaTitle: 'Got junk that’s been sitting too long?',
        ctaDescription:
            'Free estimate, no pressure, no sales pitch. Just an honest quote.',
    },
};

export function getServiceContent(value: string): ServiceContent | undefined {
    return servicesData[value];
}

export function getAllServiceValues(): string[] {
    return Object.keys(servicesData);
}
