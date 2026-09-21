import type { Project } from '@/types';
export const projects: Project[] = [
  {
    title: 'A small satellite with a bigger view',
    slug: 'cubesat-earth-observer',
    team: 'Team Orbit',
    members: ['Student lead', 'Electronics lead', 'Systems lead'],
    institution: 'EGS Pillay · Sample student team',
    category: 'Satellite',
    description:
      'A CubeSat-inspired model exploring how small satellites collect and transmit environmental data.',
    image: '/art/satellite.svg',
    featured: true,
    problem: 'How can students understand the practical constraints of collecting data in orbit?',
    solution:
      'A tabletop satellite model connects light and temperature sensors to a ground-station dashboard.',
    technologies: ['Microcontroller', 'Environmental sensors', 'Radio telemetry', 'CAD'],
    outcomes:
      'A proposed demonstration of sensor readings, power budgeting and a simple telemetry link.',
  },
  {
    title: 'Built for the racing line',
    slug: 'electric-racing-prototype',
    team: 'Team Velocity',
    members: ['Design lead', 'Powertrain lead', 'Testing lead'],
    institution: 'EGS Pillay · Sample student team',
    category: 'Racing',
    description:
      'An electric kart concept balancing lightweight construction, energy use and vehicle control.',
    image: '/art/racing.svg',
    featured: true,
    problem: 'How can a small electric vehicle balance speed with energy efficiency?',
    solution:
      'A scale chassis and drivetrain model lets visitors compare gearing, wheel size and battery demand.',
    technologies: ['Electric motor', 'CAD', 'Motor controller', 'Data logging'],
    outcomes:
      'A proposed comparison of design choices using bench measurements rather than unverified performance claims.',
  },
  {
    title: 'A helping hand, engineered',
    slug: 'assistive-robotic-arm',
    team: 'Team Mech Minds',
    members: ['Mechanical lead', 'Controls lead', 'Interface lead'],
    institution: 'EGS Pillay · Sample student team',
    category: 'Robotics',
    description:
      'A tabletop robotic arm designed to explore accessible control and precise everyday movement.',
    image: '/art/robotics.svg',
    featured: true,
    problem: 'How can simple controls make repetitive pick-and-place tasks more accessible?',
    solution:
      'A low-cost servo arm uses large-button controls to demonstrate repeatable movement and grip.',
    technologies: ['Servo motors', 'Arduino', '3D-printed joints', 'Inverse kinematics'],
    outcomes:
      'A proposed evaluation of grip reliability and position repeatability using lightweight objects.',
  },
  {
    title: 'Making airflow visible',
    slug: 'desktop-wind-tunnel',
    team: 'Team Aero Lab',
    members: ['Aerodynamics lead', 'Fabrication lead', 'Measurement lead'],
    institution: 'EGS Pillay · Sample student team',
    category: 'Aero',
    description:
      'A compact wind tunnel that reveals the relationship between wing shape, airflow and lift.',
    image: '/art/aero.svg',
    featured: false,
    problem: 'Airflow around a wing is difficult to understand from a textbook diagram alone.',
    solution:
      'Interchangeable airfoil models and lightweight streamers demonstrate flow patterns at different angles.',
    technologies: ['Airfoil models', 'Fan control', 'Force sensor', 'CAD'],
    outcomes: 'A proposed visual and measured comparison of wing profiles and angles of attack.',
  },
  {
    title: 'Energy from every step',
    slug: 'kinetic-energy-floor',
    team: 'Team Renew',
    members: ['Prototype lead', 'Circuit lead', 'Research lead'],
    institution: 'EGS Pillay · Sample student team',
    category: 'Physics',
    description:
      'A working-model concept investigating how mechanical movement can become electrical energy.',
    image: '/art/physics.svg',
    featured: false,
    problem: 'What are the capabilities and limitations of harvesting energy from human movement?',
    solution:
      'A demonstration tile connects a mechanical input to a small generator and measurement display.',
    technologies: ['Generator', 'Rectifier', 'Multimeter', 'Energy storage'],
    outcomes: 'A proposed measurement of conversion losses and small-scale energy output.',
  },
  {
    title: 'Water, measured thoughtfully',
    slug: 'smart-irrigation',
    team: 'Team Groundwork',
    members: ['Sensor lead', 'Software lead', 'Field research lead'],
    institution: 'EGS Pillay · Sample student team',
    category: 'Engineering',
    description: 'A soil-monitoring prototype that helps explain when and why a plant needs water.',
    image: '/art/engineering.svg',
    featured: false,
    problem: 'Fixed watering schedules do not always reflect actual soil conditions.',
    solution:
      'Soil sensors drive a small pump in a transparent demonstration bed with manual override.',
    technologies: ['Soil moisture sensors', 'Microcontroller', 'Pump relay', 'Dashboard'],
    outcomes:
      'A proposed comparison between timed watering and sensor-led watering in controlled conditions.',
  },
];
