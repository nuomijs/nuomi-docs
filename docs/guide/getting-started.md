# 快速上手

我们知道后台管理系统通常由登录页面和工作台组成，登录时校验账号密码通过后会跳转到工作台，工作台一般由菜单、导航以及内容区域构成，通过编写一个简单的后台管理系统，让大家更快速的理解和使用 nuomi。

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
│       ├── detail           // 详细详细模块
│       │   ├── index.js
│       │   ├── components
│       │   │   └── Layout
│       │   ├── effects
│       │   └── services
│       ├── index            // 首页模块
│       │   ├── index.js
│       │   ├── components
│       │   │   └── Layout
│       │   ├── effects
│       │   └── services
│       ├── list             // 列表模块
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

### 编写 UI 组件

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

登录功能需要获取账号密码，在这个例子中可以用 2 种方式登录，获取账号密码的方式可以通过 ref 或者内部状态，可是如果组件嵌套深甚至跨组件的话，获取值就变得复杂麻烦。如果产品经理希望登录后再返回到登录页面，保留之前的登录状态，那处理起来就更加麻烦，这时我们可以使用状态管理库来处理这些问题，nuomi 中使用就是 [redux](https://redux.js.org) 来进行统一状态管理。

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
  async login() {
    const { username, password, loading } = this.getState();
    if (!loading) {
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
通常不建议effects使用函数形式，主要是不方便复用。下面我们修改组件代码，编辑 src/login/components/Layout/index.jsx
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
-     }
-   }
- };
+ const login = () => {
+   dispatch({ type: 'login' });
+ }
  ...
};

- export default connect(({ username, password }) => ({ username, password }))(Layout);
+ export default connect(({ username, password, loading }) => ({ username, password, loading }))(Layout);
```

## 进阶

### 按需加载
