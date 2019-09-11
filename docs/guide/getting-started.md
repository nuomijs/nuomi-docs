# 快速上手

后台管理系统通常由登录页面和工作台组成，登录时校验账号密码通过后会跳转到工作台，工作台一般由菜单、导航以及内容区域构成，接下来通过编写一个简单的后台管理系统，让大家更快速的理解和使用 nuomi。

## 安装

在此之前你需要安装 [nodejs](https://nodejs.org) ，初始化项目可以使用你所喜欢的脚手架，这里我们通过 [create-react-app](https://github.com/facebook/create-react-app) 来初始化项目，包管理工具使用的是 [yarn](https://www.yarnpkg.com/lang/en/) ，你也可以使用 [npm](https://www.npmjs.com/) 来安装。
```
yarn global add create-react-app
create-react-app nuomi-project
cd nuomi-project
yarn add nuomi
yarn start
```

## 构建目录

src 目录结构如下所示

```
├── App.js    // 应用程序组件主入口
├── index.js  // 应用程序主入口
├── login     // 登录模块
│   ├── index.js    // 登录模块主入口
│   ├── components  // 登录模块组件目录
│   │   └── Layout  // 登录模块入口组件
│   ├── effects     // 登录模块业务逻辑目录
│   └── services    // 登录模块接口目录
├── platform             // 工作台模块
│   ├── index.js         // 工作台模块主入口
│   ├── layout           // 工作台框架布局目录
│   │   ├── index.js     // 工作台布局模块主入口
│   │   ├── components   // 工作台布局模块组件目录
│   │   │   └── Layout   // 工作台布局模块入口组件
│   │   ├── effects      // 工作台布局模块业务逻辑目录
│   │   └── services     // 工作台布局模块接口目录
│   └── pages                // 工作台路由模块目录
│       ├── index            // 首页模块
│       │   ├── index.js
│       │   ├── components
│       │   │   └── Layout
│       │   ├── effects
│       │   └── services
│       └── setting          // 设置模块
│           ├── index.js
│           ├── components
│           ├── effects
│           └── services
└── public              // 公共模块目录
    ├── config.js       // 配置模块
    ├── index.js        // 公共模块入口
    ├── components      // 公共组件目录
    ├── services        // 公共接口目录
    └── styles          // 公共样式目录
```

如果你使用的是 [vscode](https://code.visualstudio.com/) ，可以使用 [nuomi-vscode](https://github.com/nuomijs/nuomi-vscode) 插件快速创建目录。这里的目录结构可以根据实际情况进行调整，比如可以在 platform 下面新增一个 public 目录，作为工作台公共模块配置，也可以删除各自模块中的 sevices，把所有接口配置到公共接口目录中。

## 编写应用

### 定义路由

我们先从登录模块开始，编辑 src/App.js

```diff
import React from 'react';
+ import { Router, Route } from 'nuomi';
+ import login from './login';
- import logo from './logo.svg';
- import './App.css';

function App() {
  return (
+    <Router>
+      <Route path="/login" {...login} />
+    </Router>
-    <div className="App">
-      <header className="App-header">
-        <img src={logo} className="App-logo" alt="logo" />
-        <p>
-          Edit <code>src/App.js</code> and save to reload.
-        </p>
-        <a
-          className="App-link"
-          href="https://reactjs.org"
-           arget="_blank"
-          rel="noopener noreferrer"
-        >
-          Learn React
-        </a>
-      </header>
-    </div>
  );
}

export default App;
```

打开浏览器看到页面是空白的，而且路由地址也不对，我们定义的是 /login ，希望页面打开后展示 #/login，这是因为默认地址是 / ，需要进行重定向，编辑 src/App.js

```diff
- import { Router, Route } from 'nuomi';
+ import { Router, Route, Redirect } from 'nuomi';
import login from './login';

function App() {
  return (
    <Router>
      <Route path="/login" {...login} />
+     <Redirect from="/" to="/login" />
    </Router>
  );
}
```

可以发现路由自动重定向到 /login 页面，接下来我们来编写登录模块，编辑 src/login/index.js

```js
import React from 'react';
import Layout from './components/Layout';

export default {
  render() {
    return <Layout />;
  }
};
```

该模块导出一个对象，从上面 App 组件中可以看到，对象值就是 Route 组件的 props，该对象在 nuomi 中被叫做 **nuomiProps**，详细可以查看 [api](/api/)，它包含一个 render 方法并返回一个组件，该组件就是 /login 路由所需要渲染的组件，组件名不是强制命名为 Layout，但考虑到该组件是承担入口的作用，而且主要用于布局，因此建议叫 Layout。

### 定义接口

因为登录需要登录接口，在编写组件之前，我们先定义好接口，编辑 src/login/services/index.js

```js
import request from 'nuomi-request';

export default request.create(
  {
    login: "/api/login:post"
  },
  {
    login: {
      status: 200,
      data: {}
    }
  }
);
```
[nuomi-request](https://github.com/nuomijs/nuomi-request) 还在开发阶段，尚不能使用，实际中你可以选择自己喜欢的请求库，只要请求返回的promise即可。

### 编写UI组件

编辑 src/login/components/Layout/index.jsx

```js
import React, { useState } from 'react';
import services from '../../services';

const Layout = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e, name) => {
    const { value } = e.target;
    name === 'username' ? setUsername(value) : setPassword(value);
  };

  const login = async () => {
    if(!loading){
      if (username === 'nuomi' && password === 'nuomi') {
        setLoading(true);
        await services.login({ username, password });
        setLoading(false);
      } else {
        window.alert('账号密码有误');
      }
    }
  };

  const keydown = (e) => {
    if (e.keyCode === 13) {
      login();
    }
  };

  return (
    <fieldset>
      <legend>登 录</legend>
      <p>
        账号：
        <input type="text" value={username} onChange={(e) => change(e, 'username')} />
      </p>
      <p>
        密码：
        <input type="password" value={password} onChange={(e) => change(e, 'password')} onKeydown={keydown} />
        回车也可以登录！
      </p>
      <p>
        <button onClick={login}>{!loading ? '登 录' : '正在登录...'}</button>
      </p>
    </fieldset>
  );
};

export default Layout;
```

登录功能需要获取账号密码，在这个例子中可以用 2 种方式登录，获取账号密码的方式可以通过 ref 或者内部状态，如果组件嵌套深甚至跨组件的话，获取值就变得复杂麻烦。后期产品经理希望登录后再返回到登录页面，保留之前的登录状态，那处理起来就更加麻烦，这时我们可以使用状态管理库来处理这些问题，nuomi 中使用就是 [redux](https://redux.js.org) 来进行统一状态管理。

### 定义状态

编辑 src/login/index.js

```diff
...
export default {
+ state: {
+   username: '',
+   password: '',
+ },
  render() {
    return <Layout />;
  },
};
```

使用过 redux 的同学应该知道，状态可以按模块进行拆分，为每个模块定义 recuder，并设置一个唯一的 key，获取状态时都需要这个 key，这样就导致了状态与组件间太耦合，不易复用，nuomi 中无需声明该 key，即可以获取当前模块状态。

### 获取状态

组件中获取状态，需要通过 connect 高阶组件包装，编辑 src/login/components/Layout/index.jsx

```diff
import React from 'react';
+ import { connect } from 'nuomi';
import services from '../../services';

- const Layout = () => {
+ const Layout = ({ username, password, dispatch }) => {
- const [username, setUsername] = useState('');
- const [password, setPassword = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e, name) => {
    const { value } = e.target;
-   name === 'username' ? setUsername(value) : setPassword(value);
+   dispatch({
+     type: '_updateState',
+     payload: {
+       [name]: value,
+     },
+   });
  };
  ...
};

- export default Layout;
+ export default connect(({ username, password }) => ({ username, password }))(Layout);
```

上面 dispatch 用于更新状态，type 是[内置](/api/#nuomi-2)的，定义在 reducers 中，你也可以在 nuomiProps 中自定义 type，编辑 src/login/index.js

```diff
...
export default {
  state: {
   username: '',
   password: '',
  },
+ reducers: {
+   setState: (state, { payload }) => ({ ...state, ...payload }),
+ },
  render() {
    return <Layout />;
  },
};
```

编辑 src/login/components/Layout/index.jsx

```diff
...
const Layout = ({ username, password, dispatch }) => {
  const change = (e, name) => {
    const { value } = e.target;
    dispatch({
-     type: '_updateState',
+     type: 'setState',
      payload: {
        [name]: value,
      },
    });
  };
  ...
};
...
```

修改代码后，可以看到和 \_updateState 是同样的效果，不过这里建议没有特殊情况，建议只使用 \_updateState 即可。

到目前为止，我们使用 redux 解决了状态跨组件通信问题，但是还有一个问题没有解决。回顾下 Layout 组件中的代码，login是一个异步操作，回车和按钮登录都调用了login，实际和状态一样也存在跨组件通信问题，但是它不能定义在状态中，除此之外我们不应该把业务逻辑写到组件中，因为随着业务的升级，可能会导致组件中业务代码越来越多，即不利于复用也不利于维护。

### 异步操作
nuomi中可以使用effects来定义异步操作。effect即副作用，在函数式编程中，计算以外的操作都属于副作用，常见的就是数据库读写、I/O操作等。下面我们来改写代码，首先编辑 src/login/index.js
```diff
import React from 'react';
import Layout from './components/Layout';
+ import effects from './effects';

export default {
  state: {
   username: '',
   password: '',
+  loading: false,
  },
+ effects,
  reducers: {
    setState: (state, { payload }) => ({ ...state, ...payload }),
  },
  render() {
    return <Layout />;
  },
};
```
effects建议单独文件定义，即方便维护，也方便拆分。编辑 src/login/effects/index.js
```js
import services from '../services';

export default {
  async login({ username, password, loading }) {
    if (!loading) {
      if (username === 'nuomi' && password === 'nuomi') {
        this.dispatch({
          type: '_updateState',
          payload: {
            loading: true,
          },
        });
        await services.login({ username, password });
        this.dispatch({
          type: '_updateState',
          payload: {
            loading: false,
          },
        });
      } else {
        window.alert('账号密码有误')
      }
    }
  }
}
```
编辑 src/login/components/Layout/index.jsx
```diff
import React from 'react';
import { connect } from 'nuomi';
- import services from '../../services';

- const Layout = ({ username, password, dispatch }) => {
+ const Layout = ({ username, password, loading, dispatch }) => {
- const [loading, setLoading] = useState(false);
  ...
- const login = async () => {
-   if(!loading){
-     if (username === 'nuomi' && password === 'nuomi') {
-       setLoading(true);
-       await services.login({ username, password });
-       setLoading(false);
-     } else {
-       window.alert('账号密码有误');
-     }
-   }
- };
+ const login = () => {
+   dispatch({
+     type: 'login',
+     payload: {
+       loading,
+       username,
+       password,
+     },
+   });
+ }
  ...
};

- export default connect(({ username, password }) => ({ username, password }))(Layout);
+ export default connect(({ username, password, loading }) => ({ username, password, loading }))(Layout);
```
dispatch中的type不仅可以调用reducers中的方法，也可以调用effects中的方法，传递的payload可以在通过effects定义的方法参数中获取。
::: tip
effects中方法不能和reducers中方法重名，因为无法区分调用的是哪一个
:::

我们可以通过另外一种更好的方式实现相同的功能，编辑 src/login/components/Layout/index.jsx
```diff
...
 const login = () => {
    dispatch({
      type: 'login',
-     payload: {
-       loading,
-       username,
-       password,
-     },
    });
  }
...
```
编辑 src/login/effects/index.js
```diff
...
export default {
-  async login({ username, password, loading }) {
+  async login() {
+   const { username, password, loading } = this.getState();
    if (!loading) {
      if (username === 'nuomi' && password === 'nuomi') {
        this.dispatch({
          type: '_updateState',
          payload: {
            loading: true,
          },
        });
        await services.login({ username, password });
        this.dispatch({
          type: '_updateState',
          payload: {
            loading: false,
          },
        });
      } else {
        window.alert('账号密码有误');
      }
    }
  }
}
```
当effects是对象时内置了getState、dispatch、getNuomiProps三个方法，getState可以获取当前模块状态，dispatch用于更新当前模块状态，getNuomiProps用于获取nuomiProps对象。effects也支持函数形式，可以返回对象也可以返回类的实例，但是不提供getState、dispatch、getNuomiProps，需要你手动传进去，如下代码：
```js
export default {
  state: {}
  effects() {
    const { getState, dispatch } = this.store;
    return {
      async login() {
        const { data } = getState();
        await service.login(data);
        dispatch({
          type: '_updateState',
        });
      }
    };
  },
}
```
上面用到了this.store，后面会详细介绍，通常不建议effects使用函数形式，不太方便复用。

有经验的同学可以发现effects login方法中调用了2次dispatch有很多重复代码，如果模块多，重复代码就越多，写起来也麻烦。可以考虑把重复部分抽离出来，编辑 src/login/effects/index.js
```diff
...
export default {
+ updateState(payload) {
+   this.dispatch({
+     type: '_updateState',
+     payload,
+   });
+ },
  async login() {
    const { username, password, loading } = this.getState();
    if (!loading) {
      if (username === 'nuomi' && password === 'nuomi') {
-       this.dispatch({
-         type: '_updateState',
-         payload: {
-           loading: true,
-         },
-       });
+       this.updateState({ loading: true });
        await services.login({ username, password });
-       this.dispatch({
-         type: '_updateState',
-         payload: {
-           loading: false,
-         },
-       });
+       this.updateState({ loading: false });
      } else {
        window.alert('账号密码有误');
      }
    }
  }
}
```
可以看到代码清爽了很多，但是总不能每个模块都定义一遍 updateState 方法吧。
### 公共配置
nuomi中可以通过配置做到统一复用，编辑 src/login/effects/index.js
```diff
...
export default {
- updateState(payload) {
-   this.dispatch({
-     type: '_updateState',
-     payload,
-   });
- },
...
}
```
编辑 src/public/config.js
```js
import { nuomi } from 'nuomi';

nuomi.config({
  effects: {
    updateState(payload) {
      this.dispatch({
        type: '_updateState',
        payload,
      });
    },
  },
});
```
编辑 src/public/index.js
```js
import './config';
```
编辑 src/index.js
```diff
import React from 'react';
import ReactDOM from 'react-dom';
- import './index.css';
+ import './public';
```
只要是 nuomiProps，都可以通过 nuomi.config 进行配置，如果你配置多次，它会与上一次配置进行浅合并，这里注意命名，可能会导致覆盖问题。config.js 不单单可以配置nuomi公共部分，只要是全局配置相关都应该配置到此文件中，比如请求库配置，组件库配置等。

至此登陆页面已经完成了，接下来我们来编写工作台模块。

### 子路由
工作台与登陆页面不同，由导航和内容组成，可变部分只有内容，不可能给每个页面都定义导航，这时就需要用到子路由，外层路由负责渲染布局模块，内部路由负责渲染内容。编辑 src/App.js
```diff
- import { Router, Route, Redirect } from 'nuomi';
+ import { Router, Route, NuomiRoute, Redirect } from 'nuomi';
import login from './login';
+import platform from './platform';

function App() {
  return (
    <Router>
      <Route path="/login" {...login} />
+     <NuomiRoute pathPrefix="/platform" {...platform} />
      <Redirect from="/" to="/login" />
    </Router>
  );
}
```
Nuomi 和 NuomiRoute 组件主要用于布局，只是NuomiRoute多了路由相关功能，它并没有 path 属性，而是 pathPrefix ，从字面意思可以看出是路径前缀，其实就是起到了匹配路径的作用，这里定义工作台路由path全部以/platform开头，比如首页是/platform，设置页是/platfrom/setting，否则就无法匹配，基于此原因NuomiRoute不是很方便开发多级嵌套路由的场景，如果你的项目需求是需要多级嵌套路由，那可能nuomi并不适合你。

接下来我们来编写工作台模块，因为模块写法和登录模块一样，后面就不会详细介绍，编辑 src/platform/index.js
```js
export * from './layout';
```
编辑 src/platform/layout/services/index.js
```js
import request from 'nuomi-request';

export request.create({
  getUser: '/api/getUser'
}, {
  getUser: {
    status: 200,
    data: {
      username: 'nuomi',
    },
  }
});
```

编辑 src/platform/layout/effects/index.js
```js
import services from '../services';

export default {
  async getUser() {
    this.updateState({ loading: true });
    const { username } = await services.getUser();
    this.updateState({ loading: false, username });
  },
}
```

编辑 src/platform/layout/index.js
```js
import React from 'react';
import effects from './effects';
import Layout from './components/Layout';

export default {
  id: 'global',
  state: {
    // 用户名
    username: '',
  },
  effects,
  render() {
    return <Layout />
  },
  onInit() {
    this.store.dispatch({
      type: 'getUser',
    });
  },
}
```
nuomi中的 reducer 全部是动态创建的，Nuomi、NuomiRoute、Route组件在创建时才会创建 reducer，反之在卸载时也会移除，只有 reducer 在创建后才可以对状态操作，上面 nuomiProps 中的 onInit 就是在 reducer 被创建后触发，Route组件中的onInit与Nuomi和NuomiRoute中的稍微有些区别，后面会详细介绍。

前面说过一个 reducer 对应一个唯一的key，nuomi中创建 reducer 时也要定义这个key，只是默认情况下会动态创建，值会以 nuomi_1、nuomi_2...形式递增。当然也可以手动定义，在 nuomiProps
中通过 id 属性定义，它在nuomi中被叫做storeId，一般不建议手动定义，除非必须，比如跨模块通信。我们知道redux中所有的状态都存到一个全局的store对象中的，通过store.getState可以获取所有状态，状态的key就是reducer对应的key，每次读写状态都需要传这个key太麻烦，也不利于复用。nuomi为每个模块定义了一个私有store，用于访问自身模块状态，该store只有getState和dispatch2个方法，在 nuomiProps 方法内，通过this.store访问，这里this等同nuomiProps。

编辑 src/platform/layout/components/Layout/index.jsx
```js
import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Content from '../Content';

const Layout = () => {
  return (
    <div>
      <Header>
      <Sidebar />
      <Content />
    </div>
  );
};
```
编辑 src/platform/layout/components/Header/index.jsx
```js
import React from 'react';
import { connect } from 'nuomi';

const Header = ({ username }) => {
  return (
    <div>{username}</div>
  );
};

export default connect(({ username }) => ({ username }))(Header);
```
编辑 src/platform/layout/components/Sidebar/index.jsx
```js
import React from 'react';
import { Link, connect } from 'nuomi';

const Sidebar = () => {
  const paths = [{
    path: '/platform',
    title: '首页',
  }, {
    path: '/platform/setting',
    title: '设置',
  }];
  return (
    <div>
      {paths.map(({ path, title }) => (
        <div key={path}>
          <Link to={path}>{title}</Link>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
```
编辑 src/platform/layout/components/Content/index.jsx
```js
import React from 'react';
import { Route, Redirect } from 'nuomi';
import index from '../../pages/index';
import setting from '../../pages/setting';

const Content = () => {
  return (
    <div>
      <Route path="/platform" {...index} />
      <Route path="/platform/setting" {...setting} />
      <Redirect to="/platform" />
    </div>
  );
};

export default Content;
```

编辑 src/platform/pages/index/components/Layout/index.jsx
```js
import React from 'react';

const Layout = () => {
  return (
    <div>
      hello,首页
    </div>
  );
};

export default Layout;
```

编辑 src/platform/pages/setting/components/Layout/index.jsx
```js
import React from 'react';

const Layout = () => {
  return (
    <div>
      hello,设置
    </div>
  );
};

export default Layout;
```

访问页面，可以看到页面正常跳转，至此工作台基本框架已经搭建完成，具体的业务功能稍后再说。
### 路由跳转
还记得登录模块功能吗，功能是要登录后自动跳转到工作台，目前并没有跳转，现在我们来实现它，编辑 src/login/effects/index.js
```diff
import services from '../services';
+ import { router } from 'nuomi';

export default {
  async login() {
    const { username, password, loading } = this.getState();
    if (!loading) {
      if (username === 'nuomi' && password === 'nuomi') {
        this.updateState({ loading: true });
        await services.login({ username, password });
        this.updateState({ loading: false });
+       router.location('/platform');
      } else {
        window.alert('账号密码有误');
      }
    }
  }
}
```
[router](/api/#router) 提供了很多路由相关的功能方法，其中location是最常用的方法之一，通过他可以实现跳转、路由刷新、甚至是路由之间的模块通信。
## 进阶
### 按需加载
### loading
### 跨模块通信
### 缓存路由

