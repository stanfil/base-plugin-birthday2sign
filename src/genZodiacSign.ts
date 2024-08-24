export function genZodiacSign(timestamp: number, lang = 'en') {
  const zodiacSigns = {
    aries: { name: { en: "Aries", zh: "白羊座" }, startDate: '03-21', endDate: '04-19' },
    taurus: { name: { en: "Taurus", zh: "金牛座" }, startDate: '04-20', endDate: '05-20' },
    gemini: { name: { en: "Gemini", zh: "双子座" }, startDate: '05-21', endDate: '06-20' },
    cancer: { name: { en: "Cancer", zh: "巨蟹座" }, startDate: '06-21', endDate: '07-22' },
    leo: { name: { en: "Leo", zh: "狮子座" }, startDate: '07-23', endDate: '08-22' },
    virgo: { name: { en: "Virgo", zh: "处女座" }, startDate: '08-23', endDate: '09-22' },
    libra: { name: { en: "Libra", zh: "天秤座" }, startDate: '09-23', endDate: '10-22' },
    scorpio: { name: { en: "Scorpio", zh: "天蝎座" }, startDate: '10-23', endDate: '11-21' },
    sagittarius: { name: { en: "Sagittarius", zh: "射手座" }, startDate: '11-22', endDate: '12-21' },
    capricorn: { name: { en: "Capricorn", zh: "摩羯座" }, startDate: '12-22', endDate: '01-19' },
    aquarius: { name: { en: "Aquarius", zh: "水瓶座" }, startDate: '01-20', endDate: '02-18' },
    pisces: { name: { en: "Pisces", zh: "双鱼座" }, startDate: '02-19', endDate: '03-20' },
  };

  const date = new Date(timestamp);
  const month = date.getMonth() + 1; // JavaScript 的 getMonth() 方法返回 0-11，所以需要加 1
  const day = date.getDate();
  const formattedDate = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  for (const sign in zodiacSigns) {
    const { startDate, endDate, name } = zodiacSigns[sign];
    if ((formattedDate >= startDate && formattedDate <= endDate) ||
        (sign === 'capricorn' && (formattedDate >= startDate || formattedDate <= endDate))) {
      return name[lang] || name['en']; // 返回指定语言的星座名称，如果没有则返回英文名称
    }
  }

  return null; // 如果没有找到匹配的星座，返回 null
}