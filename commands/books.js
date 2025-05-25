const axios = require( axios );
const cheerio = require( cheerio );
const fs = require( fs );
const { promisify } = require( util );
const writeFileAsync = promisify(fs.writeFile);

module.exports = {
  name: "كتاب",
  alias: ["book", "بحث كتاب", "تحميل كتاب"],
  desc: "البحث عن كتب وتحميلها من مصادر حقيقية",
  category: "خدمات",
  usage: `كتاب <اسم الكتاب>`,
  react: "📚",
  start: async (Knight, m, { text, prefix, args }) => {
    if (!args[0]) {
      return m.reply(`الرجاء إدخال اسم الكتاب للبحث. مثال:\n${prefix}كتاب الأب الغني والأب الفقير`);
    }

    const bookName = args.join(   );
    
    try {
      // البحث في PDF Drive (مصدر حقيقي لتحميل الكتب)
      m.reply(`🔍 جاري البحث عن "${bookName}" في PDF Drive...`);
      
      const pdfDriveResults = await searchPDFDrive(bookName);
      
      if (pdfDriveResults.length === 0) {
        return m.reply("⚠️ لم يتم العثور على أي كتب تطابق بحثك في PDF Drive.");
      }
      
      // عرض نتائج البحث
      let bookList = "📚 *نتائج البحث من PDF Drive* 📚\n\n";
      pdfDriveResults.forEach((book, index) => {
        bookList += `${index + 1}. *${book.title}*\n   📝 ${book.pages ||  صفحات غير معروفة }\n   📊 ${book.size ||  حجم غير معروف }\n\n`;
      });
      
      bookList += "الرد برقم الكتاب الذي تريد تحميله (1-5) أو اكتب  إلغاء  للإلغاء.";
      
      await Knight.sendMessage(m.from, { text: bookList }, { quoted: m });
      
      // انتظار اختيار المستخدم
      const filter = (message) => {
        return !message.isGroupMsg && message.sender === m.sender && 
               (message.text.match(/^[1-5]$/) || message.text.toLowerCase() ===  إلغاء );
      };
      
      const collection = await Knight.awaitMessages(m.from, filter, {
        max: 1,
        time: 60000,
        errors: [ time ]
      });
      
      const response = collection.first().text;
      
      if (response.toLowerCase() ===  إلغاء ) {
        return m.reply("تم إلغاء العملية.");
      }
      
      const selectedIndex = parseInt(response) - 1;
      const selectedBook = pdfDriveResults[selectedIndex];
      
      // تحميل الكتاب
      m.reply("⏳ جاري تحميل الكتاب...");
      
      const downloadUrl = `https://www.pdfdrive.com${selectedBook.link}`;
      const downloadLink = await getPDFDriveDownloadLink(downloadUrl);
      
      if (downloadLink) {
        await Knight.sendMessage(
          m.from,
          {
            text: `📥 *تم العثور على الكتاب!*\n\n*العنوان:* ${selectedBook.title}\n*الرابط:* ${downloadLink}\n\nيمكنك الضغط على الرابط لتحميل الكتاب مباشرة.`
          },
          { quoted: m }
        );
      } else {
        await Knight.sendMessage(
          m.from,
          {
            text: `⚠️ تعذر الحصول على رابط تحميل مباشر.\n\nيمكنك زيارة صفحة الكتاب هنا:\nhttps://www.pdfdrive.com${selectedBook.link}`
          },
          { quoted: m }
        );
      }
      
    } catch (error) {
      console.error(error);
      m.reply("❌ حدث خطأ أثناء البحث عن الكتاب. يرجى المحاولة لاحقًا.");
    }
  }
};

// دالة للبحث في PDF Drive
async function searchPDFDrive(query) {
  const url = `https://www.pdfdrive.com/search?q=${encodeURIComponent(query)}`;
  const { data } = await axios.get(url, {
    headers: {
       User-Agent :  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 
    }
  });
  
  const $ = cheerio.load(data);
  const results = [];
  
  $( .files-new ul li ).slice(0, 5).each((i, el) => {
    const title = $(el).find( .file-right a ).text().trim();
    const link = $(el).find( .file-right a ).attr( href );
    const pages = $(el).find( .file-info .fi-pagecount ).text().trim();
    const size = $(el).find( .file-info .fi-size ).text().trim();
    
    results.push({
      title,
      link,
      pages,
      size
    });
  });
  
  return results;
}

// دالة للحصول على رابط التحميل من PDF Drive
async function getPDFDriveDownloadLink(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
         User-Agent :  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 
      }
    });
    
    const $ = cheerio.load(data);
    const downloadLink = $( #download-button-link ).attr( href );
    
    return downloadLink ? `https://www.pdfdrive.com${downloadLink}` : null;
  } catch (error) {
    console.error( Error getting download link: , error);
    return null;
  }
}
