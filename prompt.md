1. 提供WordPress的user name和application password
2. 提供WordPress的site url
3. 设置openai api key，并设置openai的api url，有可能是proxy url，以上信息均存储在浏览器的local storage中
4. 有一个web界面，可以批量上传图片，一张，或者多张
5. 批量上传图片后，依次把图片上传给openai，让openai生成图片的描述，并自动生成图片的alt
6. 把图片上传到WordPress的media库，并设置图片的描述和alt
7. 如果图片上传失败，则显示失败的原因
8. 如果图片上传成功，则显示图片的描述和alt，以及图片的小图标