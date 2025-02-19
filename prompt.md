1. 提供 WordPress 的 user name 和 application password
2. 提供 WordPress 的 site url
3. 设置 openai api key，并设置 openai 的 api url，有可能是 proxy url，以上信息均存储在浏览器的 local storage 中
4. 有一个 web 界面，可以批量上传图片，一张，或者多张
5. 批量上传图片后，依次把图片上传给 openai，让 openai 生成图片的描述，并自动生成图片的 alt
6. 把图片上传到 WordPress 的 media 库，并设置图片的描述和 alt
7. 如果图片上传失败，则显示失败的原因
8. 如果图片上传成功，则显示图片的描述和 alt，以及图片的小图标

2025-2-18 更新的功能：
在当前项目中，我想加入一个新的功能：图片压缩以及等比例裁剪，首先需要在设置页，添加一个输入框，设置图片的 max width，以及一个 checkbox，让用户可以选择是否压缩处理图片。
程序处理图片的规则如下：
如果 checkbox = unchecked，则不执行任何新操作；
如果 checkbox = checked，则根据图片的 max width，来对图片进行等比例缩放，再把图片转为 webp 格式

再缩放、转换格式完成之后，再把图片提交到 openai 的 api 去做识别，识别完成后，上传到 WordPress 的图片也要是最终压缩后的图片。

localhost server application password: nWkc NDAK 8YKF IzRM bLSg ZAoU

openai api key: sk-Rfl8L4gpNHex3ek1YiJKpbuHxoo4vte4v5bBgXQJiF5EakhZ
openai api url: https://api2.aigcbest.top/v1

allen api: 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

http://scaffold.local/
admin
xpvr jFoO 1gkg jSQP 1MhZ f5ub

1. 首先查看修改的文件状态：

```
git status
```

2. 添加修改的文件到暂存区：

```
git add .
```

3. 提交这些更改：

```
git commit -m "commit message"
```

4. 推送到 GitHub：

```
git push
```

如果你是第一次推送到这个仓库，可能需要先设置远程仓库：

```
git remote add origin https://github.com/your-username/your-repository.git
```

## wpbricksdemo.xyz application password

wp
mNAw 57Mq vFln NVNK yUk0 mGfF

## 图片压缩

图片压缩的规则：

1. 如果 checkbox = unchecked，则不执行任何新操作；
2. 如果 checkbox = checked，则根据图片的 max width，来对图片进行等比例缩放，再把图片转为 webp 格式

http://ranking.local/
fx
5PB6 VSlX BnUR PJr7 Aaql FKgL

syn application password
fx
IYpS zvjb x4yl ZuYh 9VGO Ajnn

wpbricksdemo.xyz
wp
uPOk o5rw dtvZ g1cX e31G Q3UK
