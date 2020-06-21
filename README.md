> # PC 端开发说明

## Build Setup

``` bash
# 安装依赖
npm install

# 运行项目
npm run dev

# 打包文件
npm run build

```

### UI规范
``` bash
1、整体使用媒体查询，适应不同尺寸设备（大屏幕：>1400px；笔记本：992px—1400px；平板：768px—992px；手机：320px—768px）
    示例代码：@media (min-width: 992px) and (max-width: 1400px) {}
2、宽高比例方面可使用rem布局，整屏宽等于12rem。
3、多栏多列布局优先使用百分比%或是display:flex
4、使用渐变、纯色等设计页面，避免大量使用图片。
5、能用CSS3体现的图片，尽量使用CSS3，如圆角按钮，渐变背景等。
6、商品列表中的图片要采用懒加载。
7、除公共组件外，每个vue文件里的样式表都要用scope来私有化
8、UI框架采用饿了么出品 element-ui
9、命名规则：驼峰式或下划线命名法

注：规范只列举了适配方式，无论用何种方式，需要保证在不同比例、不同尺寸的设备上，测试chrome、firefox、ie9+ 等主流浏览器。无明显错位、变形。

```

### 数据管理
``` bash
使用vuex管理数据
# 引入vuex
import store from '../store'

# 公用数据存储位置
统一放在 src/store 目录下的 state.js 文件中

# 调接口
统一放在 src/store 目录下的 actions.js 文件中

# 获取数据
统一放在 src/store 目录下的 mutations.js 文件中


详细使用教程请见API文档 ：https://vuex.vuejs.org/zh/api/
```

### 相关文件目录
``` bash
# axios配置文件以及拦截器
src 目录下的 axiosPath.js 文件

# 图片
src/assets/images 目录下

# 图标
src/assets/icons 目录下

# 公共 CSS 样式表
src/assets/css 目录下

# 页面文件
src/page 目录下

# 公共组件
src/components 目录下

# 路由配置文件
src/router 目录下的 index.js文件

# 语言数据文件
src/assets/language 目录下

# 国家区号数据文件
src/assets/country_code 目录下

# 工具类
src/utils文件夹下（如：cookie...）

# cookie 的引用 
再需要使用cookie操作的文件下 import { setCookie, getCookie, removeCookie } from './utils/cookies';

# 关于 MD5
为全局使用方便， MD5放在vue原型中。
使用示例：this.$md5('hello'); // 5d41402abc4b2a76b9719d911017c592

# 图片懒加载
使用示例：<img v-lazy="item.sellerLogoPath">

注：如需引入本地库文件，请存放在 static 目录下；
    安全起见，所有js语句要以分号结尾（避免自动整理代码格式出现代码错乱）

```

### 上传前准备
``` bash
1、所有图片均要压缩（图片压缩参考地址：https://tinypng.com/）。

```
