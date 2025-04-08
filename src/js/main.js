//=================== API Start ====================
import { api } from "./api.js";
//==================== API End =====================

//==================== Data & tools Start =====================
let curr_prayer_key = 0;
let curr_page = null;
// en: true | ar: false
let en = window.localStorage.getItem("lng") === "en" ? true : false;

const en_ar = new Map([
  // weekdays
  ["Saturday", "السبت"],
  ["Sunday", "الأحد"],
  ["Monday", "الإثنين"],
  ["Tuesday", "الثلاثاء"],
  ["Wednesday", "الأربعاء"],
  ["Thursday", "الخميس"],
  ["Friday", "الجمعة"],
  // short weakdays
  ["sat", "السبت"],
  ["sun", "الأحد"],
  ["mon", "الإثنين"],
  ["tue", "الثلاثاء"],
  ["wed", "الأربعاء"],
  ["thu", "الخميس"],
  ["fri", "الجمعة"],
  // gregorian months
  ["January", "يناير"],
  ["February", "فبراير"],
  ["March", "مارس"],
  ["April", "إبريل"],
  ["May", "مايو"],
  ["June", "يونيو"],
  ["July", "يوليو"],
  ["August", "أغسطس"],
  ["September", "سبتمبر"],
  ["October", "أكتوبر"],
  ["November", "نوفمبر"],
  ["December", "ديسمبر"],
  // hijri months
  ["Muḥarram", "محرم"],
  ["Ṣafar", "صفر"],
  ["Rabīʿ al-awwal", "ربيع الأول"],
  ["Rabīʿ al-thānī", "ربيع الثاني"],
  ["Jumādá al-ūlá", "جماد الأول"],
  ["Jumādá al-ākhirah", "جماد الثاني"],
  ["Rajab", "رجب"],
  ["Shaʿbān", "شعبان"],
  ["Ramaḍān", "رمضان"],
  ["Shawwāl", "شوال"],
  ["Dhū al-Qaʿdah", "ذو القعدة"],
  ["Dhū al-Ḥijjah", "ذو الحجة"],
  // nav
  ["Prayers", "الصلوات"],
  ["Calendar", "التقويم"],
  ["Settings", "الإعدادات"],
  // prayers
  ["Fajr", "الفجر"],
  ["Sunrise", "الشروق"],
  ["Dhuhr", "الظهر"],
  ["Asr", "العصر"],
  ["Maghrib", "المغرب"],
  ["Isha", "العشاء"],
  ["Midnight", "منتصف الليل"],
  // settings
  ["Language", "اللغة"],
  ["Theme", "السمة"],
  ["English", "إنجليزي"],
  ["Arabic", "عربي"],
  // numbers
  ["0", "٠"],
  ["1", "١"],
  ["2", "٢"],
  ["3", "٣"],
  ["4", "٤"],
  ["5", "٥"],
  ["6", "٦"],
  ["7", "٧"],
  ["8", "٨"],
  ["9", "٩"],
  // others
  ["Holiday", "المناسبة"],
  ["Times", "أوقات"],
  ["Today", "اليوم"],
  ["Prayer", "الصلاة"],
  ["Remaining Time", "الوقت المتبقي"],
  ["MG", "إم جي"],
  ["Designed-by", "تصميم"],
  ["Athan", "أذان"],
  // holidays
  ["Lailat-ul-Miraj", "ليلة الإسراء والمعراج"],
  ["Lailat-ul-Bara'at", "ليلة النصف من شعان"],
  ["1st Day of Ramadan", "أول أيام شهر رمضان الكريم"],
  ["Eid-ul-Fitr", "عيد الفطر"],
  ["Lailat-ul-Qadr", "ليلة القدر"],
  ["Hajj", "الحج"],
  ["At-Tarwiyah", "يوم التروية"],
  ["Arafa", "يوم عرفة"],
  ["Eid-ul-Adha", "عيد الأضحي"],
  ["1st Tashriq Days", "أول أيام التشريق"],
  ["2nd Tashriq Days", "ثاني أيام التشريق"],
  ["3rd Tashriq Days", "ثالث أيام التشريق"],
  ["Ashura", "يوم عاشوراء"],
  ["Mawlid al-Nabi", "مولد النبي (ص)"],
  ["Beginning of the holy months", "بداية الأشهر الحرم"],
  ["End of the holy months", "نهاية الأشهر الحرم"],
  ["Lailat-ul-Ragha'ib", "ليلة الرغائب"],
  [
    "Urs of Mawlana Shaykh Nazim al-Haqqani (ق)",
    "عرس مولانا الشيخ ناظم الحقاني (ق)",
  ],
  [
    "Birth of Sayyidina `Ali ibn Abi Talib (ر)",
    "ميلاد سيدنا علي بن أبي طالب (ر)",
  ],
  ["Urs of Sayyidina Jafar as-Sadiq (ق)", "عرس سيدنا جعفر الصادق (ق)"],
  ["Urs of Zaynab bint Ali (ر)", "عرس السيدة زينب بنت علي (ر)"],
  ["Birth of Sayyidina Husayn ibn `Ali (ر)", "مولد سيدنا الحسين بن علي (ر)"],
  ["Birth of Sayyidina Abbas ibn `Ali (ر)", "مولد سيدنا العباس بن علي (ر)"],
  ["Birth of Sayyidina `Ali ibn Husayn (ر)", "مولد سيدنا علي بن الحسين (ر)"],
  ["Urs of Imam Shamil al-Daghestani (ق)", "عرس الإمام شامل الداغستاني (ق)"],
  ["Birth of Sayyidina Qasim ibn Hasan (ر)", "مولد سيدنا القاسم بن الحسن (ر)"],
  [
    "Birth of Sayyidina Ali Akbar ibn Husayn (ر)",
    "مولد سيدنا علي الأكبر بن الحسين (ر)",
  ],
  [
    "Urs of Sayyidina Abu Yazid al-Bistami (ق)",
    "عرس سيدنا أبو يزيد البسطامي (ق)",
  ],
  ["Urs of Muhammad Usman Damani", "عرس محمد عثمان داماني"],
]);

// page_btn_id => page_id
const page_btn = new Map([
  ["prayerTimesPage", "prayer_times_btn"],
  ["settingsPage", "settings_btn"],
]);

// settings_switch_id => action_function
const settings_switches = new Map([["langSwitch", set_lang]]);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const prayers = new Map([
  [
    1,
    {
      name: "Fajr",
      s_time: "",
      time: {
        hr: 0,
        min: 0,
      },
    },
  ],
  [
    2,
    {
      name: "Sunrise",
      s_time: "",
      time: {
        hr: 0,
        min: 0,
      },
    },
  ],
  [
    3,
    {
      name: "Dhuhr",
      s_time: "",
      time: {
        hr: 0,
        min: 0,
      },
    },
  ],
  [
    4,
    {
      name: "Asr",
      s_time: "",
      time: {
        hr: 0,
        min: 0,
      },
    },
  ],
  [
    5,
    {
      name: "Maghrib",
      s_time: "",
      time: {
        hr: 0,
        min: 0,
      },
    },
  ],
  [
    6,
    {
      name: "Isha",
      s_time: "",
      time: {
        hr: 0,
        min: 0,
      },
    },
  ],
  [
    7,
    {
      name: "Midnight",
      s_time: "00:00",
      time: {
        hr: 23,
        min: 59.5,
      },
    },
  ],
]);

const get_time_only = (time) => {
  return time.slice(0, 5);
};

const get_hr_min = (time) => {
  const hr = +time.slice(0, 2);
  const min = +time.slice(3, 5);
  return [hr, min];
};

const end_of_day = () => {
  return curr_prayer_key >= prayers.size;
};

const bad_internet = () => {
  const bad_net_icon = curr_page.querySelector("i.bad-net");
  bad_net_icon.style.display = "block";

  setTimeout(() => {
    bad_net_icon.style.display = "none";
  }, 2500);
};
//===================== Data & tools End ======================

//===================== initialization Start ======================
// set the initial page
curr_page = document.getElementById("prayerTimesPage");
curr_page.style.display = "flex";
document.getElementById(page_btn.get(curr_page.id)).classList.add("picked");
set_lang();

// ➡️➡️ data init
(async () => {
  // get data from api
  const { data, address, temperature } = await api({
    time_only: false,
  });

  // do nothing if null
  if (data) {
    console.log(data);
    // Prayer Times Page
    const _today = data[new Date().getDate() - 1];
    set_times_dates(_today);
    const next_prayer_key = get_next_prayer_key();
    set_next_prayer(next_prayer_key);

    if (address) {
      // add the location
      const address_ele = document.getElementById("city_country");
      const city = address.city;
      const city_state = city ? city : address.state;
      address_ele.textContent = `${city_state} - ${address.country}`;
    }

    if (temperature) {
      const temp_ele = document.querySelector(
        ".location_temp > .temperature > .degree"
      );
      temp_ele.textContent = `${temperature}`;
    }
  } else {
    bad_internet();
  }
})();
//====================== initialization & testing End =======================

//========================= Functions Start =========================

function set_lang() {
  const all_txt = document.querySelectorAll("[data-en]");
  const logo = document.querySelector(".logo > .txt");
  const _switch = document.getElementById("langSwitch");

  if (en) {
    en = false;
    _switch.classList.add("on");
    document.body.classList.add("ar");
    logo.classList.add("ar");

    all_txt.forEach((ele) => {
      const en_txt = ele.dataset.en;
      ele.textContent = en_ar.get(en_txt);
    });
    window.localStorage.setItem("lng", "en");
  } else {
    en = true;
    _switch.classList.remove("on");
    document.body.classList.remove("ar");
    logo.classList.remove("ar");

    all_txt.forEach((ele) => {
      const en_txt = ele.dataset.en;
      ele.textContent = en_txt;
    });
    window.localStorage.setItem("lng", "ar");
  }
}

//---------- prayer Times Page ----------
const update_dates_times = async () => {
  // use this function to update the (dates & times) at the end of the day
  // get data from api
  const { data } = await api({ time_only: true });

  // do nothing if null
  if (data) {
    const _today = data[new Date().getDate() - 1];
    set_times_dates(_today);
    set_next_prayer(1);
  } else {
    bad_internet();
  }
};

// set dates & times
function set_times_dates(_today) {
  const gregorian = _today.date.gregorian;
  const hijri = _today.date.hijri;
  const timings = _today.timings;

  // save_times except midnight
  for (let i = 1, len = prayers.size; i < len; ++i) {
    const prayer = prayers.get(i);
    const time = timings[`${prayer.name}`];
    const [hr, min] = get_hr_min(time);
    prayer.s_time = get_time_only(time);
    prayer.time.hr = hr;
    prayer.time.min = min;
  }

  // weekday
  const today_name = document.getElementById("today");
  const weekday = gregorian.weekday.en;
  today_name.dataset.en = weekday; // save the english word

  // dates
  const h_month = document.querySelector(".month > .hijri");
  const g_month = document.querySelector(".month > .melady");
  const h_month_name = hijri.month.en;
  const g_month_name = gregorian.month.en;
  g_month.dataset.en = g_month_name;
  h_month.dataset.en = h_month_name;

  if (en) {
    today_name.textContent = weekday;
    h_month.textContent = h_month_name;
    g_month.textContent = g_month_name;
  } else {
    today_name.textContent = en_ar.get(weekday);
    h_month.textContent = en_ar.get(h_month_name);
    g_month.textContent = en_ar.get(g_month_name);
  }

  document.querySelector(".day > .hijri").textContent = hijri.day;
  document.querySelector(".day > .melady").textContent = gregorian.day;
  document.querySelector(".year > .hijri").textContent = hijri.year;
  document.querySelector(".year > .melady").textContent = gregorian.year;

  // times
  document.querySelector(".prayers > .fajr > .time").textContent = `${
    prayers.get(1).s_time
  }`;

  document.querySelector(".prayers > .sunrise > .time").textContent = `${
    prayers.get(2).s_time
  }`;

  document.querySelector(".prayers > .dhuhr > .time").textContent = `${
    prayers.get(3).s_time
  }`;

  document.querySelector(".prayers > .asr > .time").textContent = `${
    prayers.get(4).s_time
  }`;

  document.querySelector(".prayers > .maghrib > .time").textContent = `${
    prayers.get(5).s_time
  }`;

  document.querySelector(".prayers > .isha > .time").textContent = `${
    prayers.get(6).s_time
  }`;

  document.querySelector(".prayers > .midnight > .time").textContent = `${
    prayers.get(7).s_time
  }`;
}

// prayer counter down
function set_counter_down(key) {
  const untill = new Date();
  const curr_prayer_time = prayers.get(key).time;
  const hr = curr_prayer_time.hr;
  const min = curr_prayer_time.min;
  untill.setHours(hr, min);

  const h = document.querySelector(".counter-down > .hr");
  const m = document.querySelector(".counter-down > .min");
  const s = document.querySelector(".counter-down > .sec");

  const ms_hr = 1000 * 60 * 60;
  const ms_min = 1000 * 60;
  const ms_sec = 1000;

  // count down interval
  const intervId = setInterval(() => {
    const now = Date.now();
    const dif = untill - now;

    const hrs = Math.floor(dif / ms_hr);
    const mins = Math.floor((dif % ms_hr) / ms_min);
    const secs = Math.floor((dif % ms_min) / ms_sec);

    h.textContent = frmt_time(hrs);
    m.textContent = frmt_time(mins);
    s.textContent = frmt_time(secs);

    if (dif <= 0) {
      clearInterval(intervId);
      let athan_time_out = 60000;

      h.textContent = "00";
      m.textContent = "00";
      s.textContent = "00";

      const counter_down = document.querySelector(
        ".times > .next-prayer > .counter-down"
      );
      counter_down.classList.add("blink");

      // show athan notification
      if (Notification.permission === "granted") {
        try {
          new Notification(get_prayer_name(key), {
            icon: "../assets/imgs/logo.svg",
          });
        } catch (_) {}
      }

      setTimeout(() => {
        counter_down.classList.remove("blink");
        if (end_of_day()) {
          update_dates_times();
        } else {
          set_next_prayer(get_next_prayer_key(false));
        }
      }, athan_time_out);
    }
  }, 1000);
}

// get next prayer key
// (init) parameter to check if at first load
function get_next_prayer_key(init = true) {
  if (!init) return curr_prayer_key + 1;

  const entries = [...prayers.entries()];
  let key = 1;
  // get total minutes (hours * 60 + minutes)
  const now_time = new Date();
  const now_min = now_time.getHours() * 60 + now_time.getMinutes();
  let prev_min = -1;

  entries.some((next) => {
    const next_time = next[1].time;
    const next_min = next_time.hr * 60 + next_time.min;

    // console.log("prev:", prev_min, "| now:", now_min, "| next:", next_min);

    if (now_min >= prev_min && now_min <= next_min) {
      key = next[0]; // save the prayer key
      // console.log("yes ✅");
      // console.log(
      //   "curr_prayer_key:",
      //   curr_prayer_key,
      //   "\nnext_prayer_key:",
      //   key
      // );
      return true;
    }
    // console.log("no ❌");
    prev_min = next_min;
    return false;
  });

  return key;
}

function set_next_prayer(key) {
  const prayers_list = document.querySelectorAll(".times > .prayers > .prayer");

  if (curr_prayer_key)
    prayers_list[curr_prayer_key - 1].classList.remove("picked");

  prayers_list[key - 1].classList.add("picked");

  const prayer_name = document.querySelector(
    ".times > .next-prayer > .prayer-name"
  );
  const rem_time = document.querySelector(".times > .next-prayer > .txt");

  const name = prayers.get(key).name;
  const rem_time_txt = rem_time.dataset.en;
  prayer_name.dataset.en = name;

  if (en) {
    prayer_name.textContent = name;
    rem_time.textContent = rem_time_txt;
  } else {
    prayer_name.textContent = en_ar.get(name);
    rem_time.textContent = en_ar.get(rem_time_txt);
  }

  set_counter_down(key);
  curr_prayer_key = key;
}

function get_prayer_name(key) {
  const name = prayers.get(key).name;
  return en ? name : en_ar.get(name);
}

//========================= Functions End =========================

//========================= Events Start =========================
// Pages Btns
page_btn.forEach((btn_id, page_id, map) => {
  const page = document.getElementById(page_id);
  const btn = document.getElementById(btn_id);

  const set_page = () => {
    if (page !== curr_page) {
      page.style.display = "flex";
      curr_page.style.display = "none";
      btn.classList.add("picked");
      document.getElementById(map.get(curr_page.id)).classList.remove("picked");
      curr_page = page;
    }
  };

  btn.addEventListener("click", () => {
    set_page();
  });

  btn.addEventListener("keydown", (e) => {
    if (e.code === "Enter" || e.code === "Space") {
      set_page();
    }
  });
});

// settings switches
settings_switches.forEach((action_fun, switch_id) => {
  const _switch = document.getElementById(switch_id);

  _switch.addEventListener("click", action_fun);

  _switch.addEventListener("keydown", (e) => {
    if (e.code === "Enter" || e.code === "Space") {
      action_fun();
    }
  });
});
//========================== Events End ==========================

/* Time Start */
function frmt_time(n) {
  if (!n) return "00";
  return Math.floor(Math.log10(n)) ? n : "0" + n;
}

// update time iterval
setInterval(() => {
  const hours = document.querySelector(".clock > .time > .hr");
  const minutes = document.querySelector(".clock > .time > .min");
  const seconds = document.querySelector(".clock > .time > .sec");

  const D = new Date();
  const hrs = frmt_time(D.getHours());
  const mins = frmt_time(D.getMinutes());
  const secs = frmt_time(D.getSeconds());

  hours.textContent = hrs;
  minutes.textContent = mins;
  seconds.textContent = secs;
}, 1000);
/* Time End */
