#!/bin/bash
npm run build
scp -r ./dist/* elena-praktikum@51.250.92.246:/var/www/starsburger
ssh elena-praktikum@51.250.92.246 "chmod -R a+rX /var/www/starsburger"./
echo "Готово!"
