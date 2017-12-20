# history-query-enhancer
Enhance session history with query property.

[![npm][npm]][npm-url]
[![downloads][downloads]][downloads-url]
[![build][build]][build-url]
[![coverage][coverage]][coverage-url]

[npm]: https://img.shields.io/npm/v/history-query-enhancer.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/history-query-enhancer
[downloads]: https://img.shields.io/npm/dm/history-query-enhancer.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/history-query-enhancer
[build]: https://img.shields.io/travis/yenshih/history-query-enhancer/master.svg?style=flat-square
[build-url]: https://travis-ci.org/yenshih/history-query-enhancer
[coverage]: https://img.shields.io/coveralls/yenshih/history-query-enhancer/master.svg?style=flat
[coverage-url]: https://coveralls.io/github/yenshih/history-query-enhancer?branch=master

## Install

```bash
npm i history-query-enhancer
```

## Usage

A query enhancer for [`history`](https://github.com/ReactTraining/history) v4, since it [no longer supports](https://github.com/ReactTraining/history/issues/364#issuecomment-246751904) `query` property.

## Examples

### Basic

```js
import createBrowserHistory from 'history/createBrowserHistory';
import withQuery from 'history-query-enhancer';
import queryString from 'query-string';

const history = withQuery(queryString)(createBrowserHistory());
```

```js
console.log(history.location.query); // `location` has `query` property

// /the/path?the=query
history.push({
    pathname: '/the/path',
    query: { the: 'query' },
});

// /the/path?the=query
history.replace({
    pathname: '/the/path',
    query: { the: 'query' },
});

// /the/path?another=query
history.push({
    pathname: '/the/path',
    search: '?the=query',
    query: { another: 'query' },
});

history.block((location, action) => /* `location` has `query` property */);

history.listen((location, action) => /* `location` has `query` property */);

// /the/path?the=query
history.createHref({
    pathname: '/the/path',
    query: { the: 'query' },
});
```

It also supports `HashHistory` and `MemoryHistory`.

### Using with `react-router`

```js
import { Router } from 'react-router';

const App = () => (
    <Router history={history}>
        <Route
            path="/the/path"
            exact
            component={Home}
        />
        {/* other routes */}
    </Router>
);
```

```js
class Home extends PureComponent {
    render() {
        const { location } = this.props;
        console.log(location.query); // `location` has `query` property
        return <Header />
    }
}
```

```js
import { withRouter } from 'react-router';

class Header extends PureComponent {
    render() {
        const { location } = this.props;
        console.log(location.query); // `location` has `query` property
        return /* */;
    }
}

export default withRouter(Header);
```

### Using with `react-router-redux`

```js
import { ConnectedRouter } from 'react-router-redux';

const App = () => (
    <ConnectedRouter history={history}>
        {/* routes */}
    </ConnectedRouter>
)
```

```js
// /the/path?the=query
push({
    pathname: '/the/path',
    query: { the: 'query' },
});

// /the/path?the=query
replace({
    pathname: '/the/path',
    query: { the: 'query' },
});

// /the/path?another=query
push({
    pathname: '/the/path',
    search: '?the=query',
    query: { another: 'query' },
});
```

```js
import { routerReducer as router } from 'react-router-redux';

const store = combineReducers({
    router,
    // other reducers
})

const { location } = store.getState().router;

console.log(location.query); // `location` has `query` property
```

### Using with `react-router-redux` and `TypeScript`

```ts
import { RouterAction } from 'react-router-redux';
import { LocationState } from 'history';
import { EnhancedLocationDescriptor } from 'history-query-enhancer';

declare module 'react-router-redux' {
    export function push<Q extends {}>(location: EnhancedLocationDescriptor<Q>, state?: LocationState): RouterAction;
    export function replace<Q extends {}>(location: EnhancedLocationDescriptor<Q>, state?: LocationState): RouterAction;
}
```

## API

### `withQuery`

It receives a query transformer (such as [`query-string`](https://github.com/sindresorhus/query-string) , [`querystring`](https://github.com/Gozala/querystring) or [`qs`](https://github.com/ljharb/qs)) and returns a history enhancer.

You can provide your own query transformer. For example:

```js
import queryString from 'query-string';

const history = withQuery({
    parse(search) {
        return Object.entries(queryString.parse(search) || {}).reduce(
            (acc, [key, val]) => ({ ...acc, [key]: val && Number.isInteger(+val) ? +val : val }),
            {},
        );
    },
    stringify: queryString.stringify,
})(createBrowserHistory());
```

It will simply turn all integer-like query to integer.

## License

[MIT](http://www.opensource.org/licenses/mit-license.php)
