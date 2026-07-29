export type Language = "en" | "si";

export const dictionary: Record<Language, Record<string, string>> = {
  en: {
    // Header & Navigation
    "header.tagline": "INTER-SCHOOL INNOVATION COMPETITION",
    "header.subtitle": "ONLINE AWARENESS SESSION",

    // Public Registration Form
    "form.title": "ONLINE AWARENESS SESSION REGISTRATION",
    "form.subtitle": "Fill out the details below to complete your registration for the Online Awareness Session.",
    "form.label.fullName": "Full Name",
    "form.placeholder.fullName": "Enter your full name",
    "form.label.whatsapp": "WhatsApp Number",
    "form.placeholder.whatsapp": "e.g. 0771234567",
    "form.label.participantType": "Participant Type",
    "form.option.defaultType": "Select Type",
    "form.option.student": "Student",
    "form.option.teacher": "Teacher",
    "form.option.principal": "Principal",
    "form.label.school": "School",
    "form.placeholder.school": "Enter your school name",
    "form.label.grade": "Grade",
    "form.option.defaultGrade": "Select Grade",
    "form.option.grade8": "Grade 8",
    "form.option.grade9": "Grade 9",
    "form.option.grade10": "Grade 10",
    "form.option.grade11": "Grade 11",
    "form.option.grade12": "Grade 12",
    "form.option.grade13": "Grade 13",
    "form.option.otherGrade": "Other",
    "form.button.submit": "Confirm Registration",
    "form.button.submitting": "Processing...",

    // Info Side Panel
    "info.title": "hackX Jr. 9.0 Online Awareness Session",
    "info.description":
      "Join our exclusive online awareness session to discover everything you need to know about hackX Jr. 9.0, Sri Lanka's premier island-wide school innovation competition. Learn how to develop impactful solutions and bring your ideas to life.",
    "info.meta.dateLabel": "Date",
    "info.meta.dateValue": "1st Aug 2026",
    "info.meta.modeLabel": "Mode",
    "info.meta.modeValue": "Online",
    "info.point1.title": "Understand hackX Jr.:",
    "info.point1.desc":
      "Discover what hackX Jr. is and why it matters. Learn how the competition helps young innovators grow.",
    "info.point2.title": "Develop Winning Ideas:",
    "info.point2.desc":
      "Learn how to identify real-world problems and create innovative solutions. Understand what makes a project stand out.",
    "info.point3.title": "Learn from Industry Experts:",
    "info.point3.desc":
      "Gain valuable insights from experienced professionals. Get practical tips to prepare for your innovation journey.",
    "info.org.line1": "Organized by the Industrial Management Science Students' Association",
    "info.org.line2": "Faculty of Science, University of Kelaniya",
    "info.footer.copyright": "© 2026 hackX national hackathon series. All rights reserved.",

    // Registration Confirmation Page
    "success.badge": "Verified Submission",
    "success.title": "Registration Complete!",
    "success.message":
      "Thank you for registering, {name}. Your spot for the hackX Jr. 9.0 Online Awareness Session has been successfully reserved.",

    // WhatsApp Group CTA
    "whatsapp.badge": "Official Announcement Group",
    "whatsapp.title": "Join the Official WhatsApp Group!",
    "whatsapp.desc":
      "Get immediate access to live online session links, Q&A discussions, competition updates, and important announcements.",
    "whatsapp.button": "Join WhatsApp Group",

    // Feedback Survey
    "survey.question": "How did you hear about us?",
    "survey.optional": "(Optional)",
    "survey.option.school": "School",
    "survey.option.teacher": "Teacher",
    "survey.option.friend": "Friend",
    "survey.option.socialMedia": "Social Media",
    "survey.option.whatsapp": "WhatsApp",
    "survey.option.website": "Website",
    "survey.option.other": "Other",
    "survey.placeholder.other": "Please specify source...",
    "survey.button.submit": "Submit",
    "survey.thanks": "Thank you for your feedback! ✨",

    // Assistance & Footer
    "success.assistance": "Need assistance?",
    "success.contactUs": "Contact us",
    "success.button.registerAnother": "Register Another Person",

    // Validation & Error Messages
    "val.name.min": "Full name must be at least 3 characters",
    "val.name.max": "Full name cannot exceed 100 characters",
    "val.whatsapp.short": "WhatsApp number is too short",
    "val.whatsapp.long": "WhatsApp number is too long",
    "val.whatsapp.invalid": "Please enter a valid Sri Lankan WhatsApp number (e.g. 0771234567)",
    "val.type.required": "Please select a valid participant type",
    "val.school.min": "School name must be at least 3 characters",
    "val.school.max": "School name cannot exceed 150 characters",
    "val.grade.required": "Grade is required for student participants",
    "val.grade.invalid": "Please select a valid grade option",
    "val.captcha.required": "Bot verification is required. Please solve the captcha.",
    "val.duplicate.whatsapp": "A registration already exists with this WhatsApp number.",
    "val.connection.error": "Connection failed. Please check your internet connection.",

    // Modal & Swapper UI
    "modal.title": "Choose Preferred Language",
    "modal.subtitle": "Select your language to continue to hackX Jr. 9.0 Online Awareness Portal.",
    "modal.english": "English",
    "modal.sinhala": "සිංහල",
  },
  si: {
    // Header & Navigation
    "header.tagline": "අන්තර් පාසල් නව නිපැයුම් තරගාවලිය",
    "header.subtitle": "ONLINE දැනුවත් කිරීමේ වැඩසටහන",

    // Public Registration Form
    "form.title": "ONLINE දැනුවත් කිරීමේ වැඩසටහන් ලියාපදිංචිය",
    "form.subtitle":
      "Online දැනුවත් කිරීමේ වැඩසටහන සඳහා ලියාපදිංචිය සම්පූර්ණ කිරීමට පහත තොරතුරු පුරවන්න.",
    "form.label.fullName": "සම්පූර්ණ නම",
    "form.placeholder.fullName": "ඔබේ සම්පූර්ණ නම ඇතුලත් කරන්න",
    "form.label.whatsapp": "WhatsApp අංකය",
    "form.placeholder.whatsapp": "උදා. 0771234567",
    "form.label.participantType": "සහභාගීවන්නාගේ කාණ්ඩය",
    "form.option.defaultType": "තෝරන්න",
    "form.option.student": "ශිෂ්‍ය / ශිෂ්‍යාව",
    "form.option.teacher": "ගුරුවරයෙකු / ගුරුවරියක",
    "form.option.principal": "විදුහල්පති",
    "form.label.school": "පාසල",
    "form.placeholder.school": "ඔබේ පාසලේ නම ඇතුලත් කරන්න",
    "form.label.grade": "ශ්‍රේණිය",
    "form.option.defaultGrade": "ශ්‍රේණිය තෝරන්න",
    "form.option.grade8": "8 ශ්‍රේණිය",
    "form.option.grade9": "9 ශ්‍රේණිය",
    "form.option.grade10": "10 ශ්‍රේණිය",
    "form.option.grade11": "11 ශ්‍රේණිය",
    "form.option.grade12": "12 ශ්‍රේණිය",
    "form.option.grade13": "13 ශ්‍රේණිය",
    "form.option.otherGrade": "වෙනත්",
    "form.button.submit": "ලියාපදිංචිය තහවුරු කරන්න",
    "form.button.submitting": "සැකසෙමින් පවතී...",

    // Info Side Panel
    "info.title": "hackX Jr. 9.0 Online දැනුවත් කිරීමේ වැඩසටහන",
    "info.description":
      "ශ්‍රී ලංකාවේ ප්‍රමුඛතම අන්තර් පාසල් නව නිපැයුම් තරඟාවලිය වන hackX Jr. 9.0 පිළිබඳව ඔබ දැනගත යුතු සියල්ල දැනගැනීමට අපගේ මෙම සුවිශේෂී online දැනුවත් කිරීමේ වැඩසටහනට සම්බන්ධ වන්න. සාර්ථක නව නිපයුම් නිර්මාණය කරන්නේ කෙසේද සහ ඔබේ අදහස් යථාර්ථයක් කරගන්නේ කෙසේද යන්න මෙහිදී ඉගෙන ගන්න.",
    "info.meta.dateLabel": "දිනය",
    "info.meta.dateValue": "2026 අගෝස්තු 1",
    "info.meta.modeLabel": "මාධ්‍යය",
    "info.meta.modeValue": "Online",
    "info.point1.title": "hackX Jr. ගැන දැන ගනිමු:",
    "info.point1.desc":
      "hackX Jr. යනු කුමක්ද සහ එහි වැදගත්කම දැනගන්න. මෙම තරඟය මගින් තරුණ නව නිපැයුම්කරුවන්ගේ වර්ධනයට සහාය වන්නේ කෙසේද යන්න ඉගෙන ගන්න.",
    "info.point2.title": "ජයග්‍රාහී අදහස් නිර්මාණය කිරීම:",
    "info.point2.desc":
      "සැබෑ ලෝකයේ ගැටළු හඳුනාගෙන ඒවාට නව්‍ය විසඳුම් නිර්මාණය කරන්නේ කෙසේද යන්න ඉගෙන ගන්න. තරඟයකදී ව්‍යාපෘතියක් කැපී පෙනෙන ලෙස සකසන්නේ කෙසේදැයි අවබෝධ කරගන්න.",
    "info.point3.title": "ක්ෂේත්‍රයේ ප්‍රවීණයන්ගෙන් ඉගෙන ගන්න:",
    "info.point3.desc":
      "පළපුරුදු වෘත්තිකයන්ගේ අත්දැකීම් ගැන දැන ගන්න. ඔබේ නව නිපැයුමේ ඉදිරි ගමනට සූදානම් වීම සඳහා උපදෙස් ලබා ගන්න.",
    "info.org.line1": "කර්මාන්ත පරිපාලන විද්‍යා ශිෂ්‍ය සංගමය විසින් සංවිධානය කරනු ලබයි.",
    "info.org.line2": "විද්‍යා පීඨය, කැලණිය විශ්වවිද්‍යාලය",
    "info.footer.copyright": "© 2026 hackX ජාතික හැකතන් මාලාව. සියලුම හිමිකම් ඇවිරිණි.",

    // Registration Confirmation Page
    "success.badge": "තහවුරු කළ ඉදිරිපත් කිරීමකි",
    "success.title": "ලියාපදිංචිය සම්පූර්ණයි!",
    "success.message":
      "ලියාපදිංචි වීම පිළිබඳව ඔබට ස්තූතියි, {name}. hackX Jr. 9.0 Online දැනුවත් කිරීමේ වැඩසටහන සඳහා ඔබේ ආසනය සාර්ථකව වෙන් කර ඇත.",

    // WhatsApp Group CTA
    "whatsapp.badge": "නිල නිවේදන සමූහය",
    "whatsapp.title": "නිල WhatsApp සමූහයට එක්වන්න!",
    "whatsapp.desc":
      "සජීවී online වැඩසටහන් සබැඳි, ප්‍රශ්නෝත්තර සාකච්ඡා සහ සියලුම නවතම තොරතුරු WhatsApp හරහා ලබාගන්න.",
    "whatsapp.button": "WhatsApp සමූහයට එක්වන්න",

    // Feedback Survey
    "survey.question": "ඔබ අප ගැන දැනගත්තේ කෙසේද?",
    "survey.optional": "(තේරීම්)",
    "survey.option.school": "පාසල මගින්",
    "survey.option.teacher": "ගුරුවරයෙකුගෙන්",
    "survey.option.friend": "මිතුරෙකුගෙන්",
    "survey.option.socialMedia": "සමාජ මාධ්‍ය (Social Media)",
    "survey.option.whatsapp": "WhatsApp මගින්",
    "survey.option.website": "වෙබ් අඩවියෙන් (Website)",
    "survey.option.other": "වෙනත්",
    "survey.placeholder.other": "කරුණාකර සඳහන් කරන්න...",
    "survey.button.submit": "ඇතුළත් කරන්න",
    "survey.thanks": "ඔබගේ අදහස් වලට ස්තූතියි! ✨",

    // Assistance & Footer
    "success.assistance": "සහාය අවශ්‍යද?",
    "success.contactUs": "අපව සම්බන්ධ කරගන්න",
    "success.button.registerAnother": "තවත් අයෙකු ලියාපදිංචි කරන්න",

    // Validation & Error Messages
    "val.name.min": "සම්පූර්ණ නම අවම වශයෙන් අකුරු 3කින් සමන්විත විය යුතුය",
    "val.name.max": "සම්පූර්ණ නම අකුරු 100 නොඉක්මවිය යුතුය",
    "val.whatsapp.short": "WhatsApp අංකය ඉතා කෙටියි",
    "val.whatsapp.long": "WhatsApp අංකය ඉතා දිග වැඩියි",
    "val.whatsapp.invalid":
      "කරුණාකර නිවැරදි ශ්‍රී ලාංකික WhatsApp අංකයක් ඇතුලත් කරන්න (උදා. 0771234567)",
    "val.type.required": "කරුණාකර සහභාගිවන්නාගේ නිවැරදි කාණ්ඩය තෝරන්න",
    "val.school.min": "පාසලේ නම අවම වශයෙන් අකුරු 3කින් සමන්විත විය යුතුය",
    "val.school.max": "පාසලේ නම අකුරු 150 නොඉක්මවිය යුතුය",
    "val.grade.required": "ශිෂ්‍ය සහභාගිවන්නන් සඳහා ශ්‍රේණිය ඇතුලත් කිරීම අනිවාර්යයි",
    "val.grade.invalid": "කරුණාකර නිවැරදි ශ්‍රේණිය තෝරන්න",
    "val.captcha.required": "Bot verification අනිවාර්යයි. කරුණාකර Captcha එක සම්පූර්ණ කරන්න.",
    "val.duplicate.whatsapp": "මෙම WhatsApp අංකයෙන් දැනටමත් ලියාපදිංචියක් සිදුකර ඇත.",
    "val.connection.error":
      "සම්බන්ධතාවය අසාර්ථකයි. කරුණාකර ඔබගේ අන්තර්ජාල සම්බන්ධතාවය පරීක්ෂා කරන්න.",

    // Modal & Swapper UI
    "modal.title": "ඔබගේ මනාප මාධ්‍යය තෝරන්න",
    "modal.subtitle": "hackX Jr. 9.0 Online දැනුවත් කිරීමේ පද්ධතියට පිවිසීමට ඔබගේ මාධ්‍යය තෝරන්න.",
    "modal.english": "English",
    "modal.sinhala": "සිංහල",
  },
};

export function getTranslation(
  lang: Language,
  key: string,
  replacements?: Record<string, string>
): string {
  let text = dictionary[lang]?.[key] || dictionary.en?.[key] || key;
  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(new RegExp(`{\\s*${placeholder}\\s*}`, "g"), value);
    });
  }
  return text;
}
