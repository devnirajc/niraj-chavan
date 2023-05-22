function getYearsOfExperience(date_1, date_2) {
  let date2_UTC = new Date(
    Date.UTC(date_2.getUTCFullYear(), date_2.getUTCMonth(), date_2.getUTCDate())
  );
  let date1_UTC = new Date(
    Date.UTC(date_1.getUTCFullYear(), date_1.getUTCMonth(), date_1.getUTCDate())
  );

  let yAppendix,
    mAppendix,
    dAppendix = "";
  let days = date2_UTC.getDate() - date1_UTC.getDate();
  if (days < 0) {
    date2_UTC.setMonth(date2_UTC.getMonth() - 1);
    days += DaysInMonth(date2_UTC);
  }
  let months = date2_UTC.getMonth() - date1_UTC.getMonth();
  if (months < 0) {
    date2_UTC.setFullYear(date2_UTC.getFullYear() - 1);
    months += 12;
  }
  let years = date2_UTC.getFullYear() - date1_UTC.getFullYear();

  if (years > 1) yAppendix = " years";
  else yAppendix = " year";
  if (months > 1) mAppendix = " months";
  else mAppendix = " month";
  if (days > 1) dAppendix = " days";
  else dAppendix = " day";
  return (document.getElementById("yearsExp").innerHTML =
    years + "." + months + yAppendix);
}

function DaysInMonth(date2_UTC) {
  let monthStart = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth(), 1);
  let monthEnd = new Date(date2_UTC.getFullYear(), date2_UTC.getMonth() + 1, 1);
  let monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
  return monthLength;
}

getYearsOfExperience(new Date(2014, 6, 3), new Date());
