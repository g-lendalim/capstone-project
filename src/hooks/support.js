import befriendersKL from '../images/BefriendersKualaLumpur.jpeg';
import befriendersKuching from "../images/BefriendersKuching.jpeg";
import befriendersPenang from "../images/BefriendersPenang.jpeg";
import MIASA from "../images/MIASA.jpeg";
import MMHA from "../images/MMHA.jpeg";
import TalianKasih from "../images/TalianKasih.jpg";

const services = [
    {
        name: 'Befrienders Malaysia',
        type: 'Emergency',
        state: 'National',
        phone: '03-7627 2929',
        website: 'https://www.befrienders.org.my',
        hours: '24/7',
        image: befriendersKL,
        description: 'Emotional support for those feeling depressed, lonely, or suicidal',
    },
    {
        name: 'Talian Kasih',
        type: 'Emergency',
        state: 'National',
        phone: '15999',
        whatsapp: '019-261 5999',
        website: 'https://www.kpwkm.gov.my/talian-kasih',
        hours: '24/7',
        image: TalianKasih,
        description: 'Government helpline for crisis intervention and emergency assistance',
    },
    {
        name: 'MIASA Crisis Helpline',
        type: 'Counseling',
        state: 'National',
        phone: '1-800-180-066',
        whatsapp: '03-9765 6088',
        website: 'https://miasa.org.my/',
        hours: '24/7',
        image: MIASA,
        description: 'Mental health support and advocacy for individuals and families',
    },
    {
        name: 'MMHA (Selangor & KL)',
        type: 'Counseling',
        state: 'Selangor & Kuala Lumpur',
        phone: '03-2780 6803',
        website: 'https://mmha.org.my/find-help',
        hours: 'Mon–Fri, 9am–5pm',
        image: MMHA,
        description: 'Therapy, rehabilitation, and support services for mental health patients',
    },
    {
        name: 'Befrienders Penang',
        type: 'Emergency',
        state: 'Penang',
        phone: '04-291 0100',
        whatsapp: '011-5670 6261',
        website: 'https://www.befrienders.org.my/penang',
        hours: '3pm–12am',
        image: befriendersPenang,
        description: 'Confidential listening and emotional support for those in distress',
    },
    {
        name: 'Befrienders Kuching',
        type: 'Emergency',
        state: 'Sarawak',
        phone: '082-242800',
        whatsapp: '014-9528460',
        website: 'https://befrienderskch.org.my',
        hours: '6:30pm – 9:30pm',
        image: befriendersKuching,
        description: 'Emotional support helpline for people in crisis or needing a listening ear',
    },
];

export default services;