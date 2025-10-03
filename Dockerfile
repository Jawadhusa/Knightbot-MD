# استخدم صورة Node.js رسمية كقاعدة.
FROM node:20-alpine

# قم بتثبيت git وأدوات بناء أساسية (build-base)
# بعض حزم npm قد تتطلب هذه الأدوات.
# `apk add --no-cache` يستخدم مدير الحزم الخاص بـ Alpine لتثبيت الحزم وتقليل حجم الصورة.
RUN apk add --no-cache git python3 build-base

# تعيين دليل العمل داخل الحاوية.
WORKDIR /app

# انسخ ملف package.json.
COPY package.json ./

# قم بتثبيت التبعيات الإنتاجية.
# سيقوم npm install بإنشاء package-lock.json داخل الحاوية.
RUN npm install --production

# انسخ بقية كود التطبيق إلى دليل العمل.
COPY . .

# كشف المنفذ الذي يستمع إليه تطبيقك.
EXPOSE 3000

# أمر بدء تشغيل التطبيق عند تشغيل الحاوية.
CMD [ "npm", "start" ]
