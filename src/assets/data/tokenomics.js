// Beyaz bülten s.7 (tahsisat) + s.9 (vesting / kilit açılış takvimi) ile BİREBİR.
// schedule sırası: [1. Ay, 2. Ay, 3. Ay, 6. Ay, 1 Yıl, 2 Yıl, 3 Yıl, 5 Yıl]
const Data = [
  {
    category: "Presale",
    allocation: "40%",
    tokenAmount: "1190000000",
    schedule: ["50%", "25%", "25%", "", "", "", "", ""],
  },
  {
    category: "Reserve Liquidity",
    allocation: "25%",
    tokenAmount: "743750000",
    schedule: ["20%", "", "", "", "20%", "20%", "20%", "20%"],
  },
  {
    category: "Marketing & Partnerships",
    allocation: "15%",
    tokenAmount: "446250000",
    schedule: ["25%", "15%", "10%", "10%", "20%", "20%", "", ""],
  },
  {
    category: "Community Rewards",
    allocation: "7%",
    tokenAmount: "208250000",
    schedule: ["10%", "10%", "10%", "30%", "40%", "", "", ""],
  },
  {
    category: "Social Responsibility",
    allocation: "7%",
    tokenAmount: "208250000",
    schedule: ["", "", "", "", "50%", "50%", "", ""],
  },
  {
    category: "Ecosystem & Development",
    allocation: "5%",
    tokenAmount: "148750000",
    schedule: ["", "", "", "25%", "25%", "25%", "25%", ""],
  },
  {
    category: "Project Team",
    allocation: "1%",
    tokenAmount: "29750000",
    schedule: ["", "", "", "25%", "25%", "50%", "", ""],
  },
];

export const vestingPeriods = [
  "1st Mo", "2nd Mo", "3rd Mo", "6th Mo", "1 Year", "2 Years", "3 Years", "5 Years",
];

export default Data;
