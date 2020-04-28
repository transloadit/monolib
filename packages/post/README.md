> Even though this module is publicly accessible, we do not recommend using it in projects outside of [Transloadit](https://transloadit.com). We won't make any guarantees about its workings and can change things at any time, we won't adhere strictly to SemVer.

> This module is maintained from a private mono repo called [monolib](https://github.com/transloadit/monolib).


## Install

```bash
sudo npm -g i @transloadit/post
```

## Usage

```bash
$ post
Welcome to @transloadit/post@0.0.21. 
Please answer some questions about the blog post, 
and I'll generate a starting point and open your editor. 
? title: a fresh look at tus.io
? author: kvz
Opening'/home/kvz/code/content/_posts/2020-04-28-a-fresh-look-at-tus-io.md' in your editor .. 
Done. 
```

![image](https://user-images.githubusercontent.com/26752/80525678-e4cb1880-8991-11ea-9266-d28b884e5c35.png)

Following values can be used to detect code editor (in descending priority):

- `process.env.OPEN_FILE`
- `process.env.VISUAL`
- `process.env.EDITOR`
