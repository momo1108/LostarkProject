# 로스트아크 테스트 프로젝트

> 로스트아크 공식 open API를 활용한 테스트 프로젝트입니다.

## 개발 기술 스택

### Front-end

- react
- react-router
- redux

### Back-end

- Next.js

### 배포 서버

- Amazon Web Service EC2

## 개발 단계

### 1. 프로젝트 초기 설정

> https://us-east-1.console.aws.amazon.com/ec2/home<br>
> EC2의 무료 인스턴스를 만들어놓은게 있었다.

근데 보안 키 페어를 잃어버림 ㅠ....

어쩔수 없으니 복구해보자.

블로그 여기저기를 참조해서 방법을 알아보니 대개 아래의 과정으로 하더라.

---

1. 새로운 키 페어를 생성해야한다.

- 이건 그냥 키 페어 메뉴에서 뚝딱.(replace-momo1108.pem)
- 다시는 잃어버리지 않으리....

2. 복구에 사용할 새로운 인스턴스를 위의 키 페어로 생성한다.

- 요것도 기본설정만 하고 바로 뚝딱

3. 원본 인스턴스는 정지한다.
4. 원본 인스턴스의 Root 볼륨을 분리해서 새로운 인스턴스에 연결 후 마운트.

- 볼륨 메뉴에서 해야됨 - `볼륨 분리`
- `볼륨 연결` : 인스턴스는 새거 선택. 디바이스 이름은 대충 `/dev/xvdf` 로 설정함

5. 볼륨 내부의 public key 파일 내용을 새로 만든 키 내용으로 수정

- 먼저 새 인스턴스 ssh 접속 : `ssh ubuntu@ip주소 -i key경로` (gitbash alias로 등록하자. `alias lostark="ssh ubuntu@ip주소 -i key경로"` - ~/.bash_profile에 저장함.)
- root 계정으로 진행하자. 원본 Root 볼륨을 마운트해야한다.
- `fdisk -l` : 볼륨 확인(xvda-새로만든거, xvdf-원본 두개가 확인됨)
- ~~`mount -o nouuid /dev/xvdf1 /mnt` : 임시로 파일시스템에 우선 마운트할 때는 nouuid 옵션 사용하면 된다는듯~~
  - xvdf1, xvdf14, xvdf15 이렇게 있는데 뒤의 2개는 OS관련으로 사용된듯? 1이 파일시스템이다.
- ~~안되네?? 이러면 uuid를 바꿔야 할 것 같은데 원본 uuid를 막 바꿔도 되려나... `xfs_admin -U generate /dev/파티션`~~
  - ~~마운트 된 파티션은 안된단다.... 어쩔수 없이 원본을 바꿔야할듯. `xfs_admin -U generate /dev/xvdf1`~~
- nouuid 옵션은 xfs 파일시스템만 동작한다고한다. 내껀 ext4 파일시스템이라 `-orw` 를 사용하니 됐음
  - `mount -orw /dev/xvdf1 /mnt`
- 원본 키 내용에 새 서버 키 내용 덮어쓰기.
  - `cat /home/계정/.ssh/authorized_keys > /mnt/home/계정/.ssh/authorized_keys`
  - 아니 근데 이 작업만 하는거면 힘들게 마운트 안하고 그냥 따로 접속해서 내용 복사하고 원본에 덮어쓰기 하면 되는거 아니야?

6. 언마운트 후 새로운 인스턴스는 정지 후 Root 볼륨 분리.

- `umount /mnt`
- 원본에 연결할 때 `/dev/sda1` 으로 연결함.(여기로 안하면 인스턴스 시작할 때 `/dev/sda1`에 연결된게 없다고 안되네)
- ⚠️ 연결되는데 시간이 걸린다. 새로고침으로 확인 후 진행하자.

7. 원본 인스턴스에 Root 볼륨 연결 후 시작. 이제 연결이 된다.(된다!!!!!!!!!!!)

---

위 과정을 거쳐야한다... 파일 하나 읽어버린 대가치고는 좀 많이 귀찮다 ㅠ

다시는 잃어버리지 않게 프로젝트에 key 전용 폴더를 만들어서 보관하자.(⚠️ .gitignore 에 추가해놓기)

이미 서버에 nvm을 깔아놨다. 프로젝트를 clone 하고 그대로 빌드해보자.

> ⚠️ root 계정에 nvm 설치 후 18.15.0 버전 사용

```bash
sudo su -
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install v18.15.0
```

```bash
git clone https://github.com/momo1108/LostarkProject.git
npm ci
npm run build
npm start # 3000번 포트
```

> 실수로 nginx를 끄고 next서버를 80으로 옮겨버림.<br>
> 다시 nginx 켜고 next를 3000번포트(default)로

```bash
sudo update-rc.d -f nginx disable # nginx auto start 비활성화
sudo service nginx stop # nginx 먼저 중지
sudo update-rc.d -f nginx enable
```

> VS Code의 terminal에서 원격 접속 후 npm start 한 상태로 터미널을 꺼버리면 next 서버가 그대로 background화된다.<br>
> 종료하려면 `ps aux | grep node` 로 프로세스 ID 찾아내고(왼쪽에서 2번째),<br> > `kill -9 프로세스ID` 하면 된다.

- 3000번 포트에 Next.js 서버가 올라간다. nginx 사용해서 80번 요청 redirect 해주자.
- /etc/nginx/sites-enable/default

```nginx
server {
  listen  80;
  server_name localhost;

  location / {
    proxy_pass http://localhost:3000;
  }
}
```

#### pm2를 이용해 서버 구동과 모니터링을 해결하자.

```bash
npm i -d pm2
pm2 init simple
cd LostarkProject
pm2 init simple
nano ecosystem.config.js
```

- ecosystem.config.js(기본만 세팅)

```js
module.exports = {
  apps: [
    {
      name: "LoastarkApp",
      script: "npm start",
    },
  ],
};
```

- 테스트해보기

```bash
pm2 start ecosystem.config.js # 서버 구동(전체 앱)
pm2 start --only buildstart # 빌드&스타트 앱
pm2 start --only dev # 개발서버 앱
pm2 list # 서버들의 간단한 상태 확인
pm2 monit # in-terminal 모니터링 대쉬보드 확인
```

https 설정은 나중에 적용하기로 하자..

#### tailwindcss

예전에 사내 프로젝트 개발할 때 tailwind를 사용해봤는데 정말 편하고 좋았다.

tailwind 와 sass 를 같이 사용하기 위해서는 PostCSS를 설치해 사용하면 된다.

tailwind도 PostCSS 플러그인이기 때문에, Sass, Less, Stylus 등의 preprocessor들도 막힘없이 사용 가능하다.(Autoprefixer 처럼.)

```bash
npm i -d tailwindcss postcss autoprefixer sass
npx tailwindcss init
```

- tailwind with sass 주의점 : https://tailwindcss.com/docs/using-with-preprocessors#sass
- postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {}, // tailwind 적용
    autoprefixer: {}, // autoprefixer 적용
  },
};
```

- tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{tsx,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- 컴포넌트에서는 기본적인 사용방법을 참조하고, 재밌는것은 scss 파일에서도 tailwind 적용이 가능하다!

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  div {
    @apply bg-gray-400; // 너무 신기하네!!!
    color: red;
  }
}
```

#### 도메인 세팅

언제까지 IP로 접속할 순 없으니 세팅을 좀 해보자.

무료 도메인 호스팅을 사용해도 되긴 하지만, 찾아보니 다양한 다운사이드가 있다.(사이트 데이터와 방문자 데이터등의 강제제공, 무통보 사이트 삭제 등. 참조영상 : https://www.youtube.com/watch?v=rrHrcRMRTtQ)

웹 호스팅은 비싸서 못쓰겠지만, 최대한 싼 도메인 호스팅을 사용해보자 😂

[가비아](https://www.gabia.com/)에서 .site 도메인이 2000원에 판매되고있다. 이건 못참지.(1년만 할인해줌 ㅋㅋ)

loaple.site 로 사용하자. dns record 세팅 후 48시간까지 걸릴 수 있다고한다.

### 2. 프로젝트 설계

프로젝트 설계단계가 제일 어려운것 같다... 여러가지 단계가 있지만 간단간단하게 해보자.

#### 1. 요구분석

[Lostark Open API](https://developer-lostark.game.onstove.com/)에서 api를 제공한다.(발급받은 토큰은 `.env.local` 에 은밀히 보관중)

api기능을 모두 활용하기에는 너무 방대하니 일단, 가장 많이 사용되는 loawa를 참조하여 만들어보자.

가장 기본적인 기능은 본인의 캐릭터 정보를 디스플레이해주는 페이지이다.
캐릭터 이미지는 공식홈페이지에서 긁어왔다.

- 메인 페이지 : 간단하게 메뉴를 출력해주는 메인 페이지이다.
  - 기본 사용 메뉴를 설정할 수 있도록 만들고, 설정이 된 경우 메인 페이지를 skip하고 해당 메뉴로 redirect한다.
  - 설정 정보는 간단히 localStorage에 저장하자.
  - 메뉴는 어떻게 할까?
    - 캐릭터 정보 메뉴
    - 각인 세팅 메뉴
    - 트라이포드 가격 예상(있으면 좋을것같아서)

#### 폰트 설정

Roboto, NanumSquareNeo(최근에 나온 것 같다.) 두가지 폰트를 사용한다.

NanumSquareNeo의 ttf 용량이 너무 커서 woff 로 변환해서 사용했다. 파일 한개당 2MB -> 600~700KB 정도로 압축이 된다.

사용할 모든 font-weight에 대해 fontface 설정을 따로 해주어야 적용이 되더라..

```css
@font-face {
  font-family: "NanumSquareNeo";
  src: url("../fonts/NanumSquareNeo/NanumSquareNeo-bRg.woff") format("woff");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "NanumSquareNeo";
  src: url("../fonts/NanumSquareNeo/NanumSquareNeo-cBd.woff") format("woff");
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: "NanumSquareNeo";
  src: url("../fonts/NanumSquareNeo/NanumSquareNeo-aLt.woff") format("woff");
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: "Roboto";
  src: url("../fonts/Roboto/Roboto-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "Roboto";
  src: url("../fonts/Roboto/Roboto-Bold.woff") format("woff");
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: "Roboto";
  src: url("../fonts/Roboto/Roboto-Light.woff") format("woff");
  font-weight: 300;
  font-style: normal;
}
```

설정한 폰트가 한꺼번에 빌드되므로 사용할것만 설정하자.

메뉴 데이터 같은 변화가 적은 데이터들은, 파일로 저장한 후 Front 단에서 API 요청으로 해당 데이터를 읽어와야 한다.

API로 사용할 ts 파일을 만들어서 pages/api/에 저장하자.

> ⚠️ api에서 fs 를 사용해 json 파일을 읽기 위해서는 절대경로로 지정해줘야하더라... 상대경로를 아무리 해보고 alias 경로를 아무리 해봐도 인식을 못해 ㅠㅠ

#### ubuntu 서버 배포시 문제점 발생

nginx 관련해서 redirect 사용 시 웹소켓이 어쩌구저쩌구...

설정을 추가해주자.

```nginx
server {
  listen  80;
  server_name localhost;

  location / {
    proxy_pass http://localhost:3000;
  }

  location /_next/webpack-hmr {
    proxy_pass http://localhost:3000/_next/webpack-hmr;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

> 폰트가 로딩되기 전에 페이지가 로딩되니까 뭔가 되게 없어보인다... 이것도 해결하자.

#### getStaticProps 관련

next app을 빌드할 때, getStaticProps 에 있는 모~~든 경우에 대하여 제대로된(유효한) props 값을 설정해주어야 한다.([Prerender Error](https://nextjs.org/docs/messages/prerender-error))

getStaticProps 를 사용할 때, Next.js의 api 기능을 활용하는것은 안된다. getStaticProps는 빌드가 진행될 때, 서버사이드에서 실행되는 내용이므로, api기능은 사용되고있지 않다. 따라서, getStaticProps에서 파일을 읽어오는 서비스를 직접적으로 사용하는 것으로 메뉴 데이터를 읽어온다.

#### 메뉴 UI 개발

벌집처럼 육각형 메뉴버튼을 활용한 메뉴를 만들어보자. 그냥 개인적으로 멋있어보여서 ㅎㅎ..

세팅하는게 보통일이 아니다... 만들어진 컴포넌트가 있으면 좋겠지만 워낙 독특한 모양이라 직접 만들었다. 하도 복잡해서 그냥 하드코딩으로 크기를 고정해놓고 만들었다.

대신 화면 너비에 맞게 데이터 구조를 재구성해서 육각형이 멀티라인으로 겹칠 수 있는 메뉴를 만들었다. 나름의 반응형 메뉴가 가능하다.

#### 캐릭터 검색창

##### 상단의 메뉴 만들기

이후의 확장성을 생각하면, 단순히 크기를 고정해놓기보다, 스크롤이 가능한 메뉴를 만들면 좋을 것 같았다.

전체적인 뼈대는 [`react-horizontal-scrolling-menu` ](https://www.npmjs.com/package/react-horizontal-scrolling-menu)라는 모듈을 사용했다.

아이콘은 http://svgicons.sparkk.fr/ , https://iconsvg.xyz/ 을 참조.

세세한 부분은 직접 css나 js를 사용해서 수정을 해줘야했다.

메뉴의 스크롤 방식은 총 3가지를 동시에 사용 가능하다.

- 1. 마우스 드래그를 통한 스크롤
  - 이 경우 MouseUp Event에서 메뉴 링크가 클릭이 되버리는 경우가 발생해서, 모듈에서 제공하는 Dragging 플래그를 사용해, 링크를 잠시 비활성화했다.
- 2. 마우스 휠을 통한 스크롤(개인적으로 강추)
  - onWheel 이벤트에 제공해주는 데모코드를 사용했다.
- 3. Arrow 버튼을 통한 스크롤
  - 가장 골치아팠다. Arrow 를 보이고 숨기는 기능이 전체 너비와 현재 스크롤에 따라 인식하는 것 같은데, 메뉴가 적어 width가 충분하지 않을 때는 우측 Arrow 버튼이 자꾸 자기맘대로 출력됐다.
  - React를 사용하고 있기 때문에, 해결하는데 애를 먹었다. 실제 DOM 요소인 메뉴 Div를 useRef로 가져와서 직접 너비를 체크해 오버플로우가 발생했는지 체크하고, 이를 플래그로 사용해서 Arrow의 출력을 조정했다.(~~이게 맞나 싶을 정도로 뭔가 더러운건 기분탓일까?~~)

기능을 열심히 구현해놓긴 했는데, 아직 실제 메뉴가 3개밖에 없어서 보여줄 방법이 없다...

더미 메뉴 데이터를 사용해야지 ㅋ.ㅋ

##### 캐릭터 검색 & 정보 디스플레이

기본적인 페이지구성은 검색바, 캐릭터 정보창이다. localStorage에 가장 최근 검색정보를 저장해놓고, 기본 출력정보로 설정을 해놓는게 좋을 것 같다.(기본 출력정보 직접 설정도 가능하게 하면 좋을듯?)

일단은 간단하게 출력내용을 정하자.

- 1. 캐릭터 정보
  - 서버
  - 길드
  - 클래스
  - 칭호
  - 전투레벨
  - 아이템레벨
  - 원정대 레벨
  - pvp 레벨
  - 영지레벨, 이름
  - 레벨 순위
  - ...
- 2. 장비 정보
  - 장비
  - 악세서리
  - 장착 각인
  - 장착 보석 정보

##### Lostark OpenAPI

위에서 정한 정보들은 작년에 LostArk 측에서 공식적으로 openAPI를 열어줬다. 야무지게 사용해보자.

발급받은 토큰은 `.env.local` 에 저장해놨다.

##### Dynamic Routes 이슈

본래 내 목적은 /character 경로 뒤에 어떤 query가 오던(`/`, `/hello`, `/a/b` 등) `[[name]].tsxx`로 받아서 처리하려고 했다.

Document를 보니 [Optional catch all routes](https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes) 라고 설명이 나와있길래 사용해봤는데 정작 개발서버나 빌드를 실행할 때 오류가 나더라...

`Error: Optional route parameters are not yet supported ("[[name]]").`

난 분명히 최신 버전을 사용했는데 이게 무슨일이지?....

이 기능을 사용할 수 있는 해결방법을 찾아보려다가, 근본적인 해결법을 찾았다. 애초에 url의 path variable로 받을 필요가 없던 문제였다. **두둥 탁!** 😂

내 목적대로라면 그냥 character/index 페이지에서 확인한 localStorage에 default name이 없으면, 초기 검색 컴포넌트를, 있으면 정보 출력 컴포넌트를 렌더하면 되는 것이었던 것이었던 것이었다.

##### 23/05/03 AWS 결제사태

새벽 2시 한국인들이 잠든시간... AWS 6달러 결제문자가 쥐도새도모르게 왔다.

분명 free tier 인스턴스였는데 왜 결제가 됐을까?

Free Tier를 사용한다 해도,사용 시작으로부터 1년동안만 무료로 제공해주기 때문이다. ㅠㅠㅠ

이미 2주일정도 사용했으니 환불은 무리일 것 같고, 재빠르게 인스턴스 삭제하고 새로운 아이디를 파보자.
(banghyechan@gmail.com)

##### Redux?

캐릭터 페이지의 구현을 하다가 고민이 생겼다. 다양한 컴포넌트들을 만들고, 여기에 컴포넌트들을 생성하다보니, props 전달이 점점 길어지고 귀찮아진다. redux를 사용하자.

`npm i redux next-redux-wrapper react-redux redux-saga redux-actions @types/redux-actions react-router-dom`

- redux next-redux-wrapper react-redux : redux 사용 관련
- redux-saga : 비동기 action 처리 middleware
- redux-actions @types/redux-actions : ducks 패턴 사용 관련
- react-router-dom : spa 관련

`npm i redux-devtools-extension -D`

- 개발 서버 store 확인 관련

> 자세한 구현은 예전 강의들을때 짠 코드를 참조했음.<br>
> ⚠️ Next.js 에서 redux 사용법은 React 에서와는 조금 다르다. 참조 블로그 : https://devkkiri.com/post/59cb38dd-f939-462d-9e7f-afcc338b621f<br>
> 해당 블로그도 예전 버전이라, 코드 수정이 몇부분있음. \_app.tsx 에서 Store 적용 방법이 조금 더 간단하진 함수를 사용<br>

```tsx
// Spread 연산자로 두번째 인자 사용
export default function App({ Component, ...rest }: AppProps) {
  // useWrappedStore 함수를 사용
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <Head>
        <title>Loaple - Lostark Helper</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}
```

##### 컴포넌트들의 Container를 만들다가 문득 든 생각

어짜피 Container의 역할이 Presentation에서 사용하는 모든 데이터와 기능들을 정의해서 전달해주는 역할인데, Next.js를 사용하는 지금의 경우에는 page 자체선에서 해결이 가능하지 않을까?

➡️ Menu 처럼 depth가 얕은 컴포넌트의 경우에는 이게 더 나을듯 한데, 메인 기능들의 페이지는 depth가 깊기 때문에, page에서 전부 전달하려면 또다시 props 지옥에 빠질 것 같다.(ex. 닉네임 검색하는 search 메서드를 페이지 -> Body 컴포넌트 -> SearchBar 컴포넌트 ... )

> 검색기록을 저장하는 방법을 컨테이너에서 state로 사용할지 redux를 사용할지 고민하다가, 일단 닉네임 검색 자체가 변경빈도가 많기 때문에, state로 만들어봤다.<br>
> 아니나 다를까, props 전달 과정에 depth가 깊어지다보니 코드가 드럽게 불어났고, 이건 아니다 싶어서 다시 되돌려서 redux로 작업을 진행했다.(지긋지긋한 삽질 🤬)

##### 캐릭터 검색 기록

캐릭터 정보 출력에 앞서 검색한 기록을 저장하려고 한다.

Redux를 활용해서, dispatch가 되면 api 요청을 보내고, 받아온 정보로 state를 업데이트한다.

기능 자체는 너무 간단한데, 위에 언급한 삽질때문에 길어졌다.

> github을 사용할 때, 디렉터리명/파일명 대소문자 구분이 안되더라... 세팅을 따로 해줘야 하는걸까? 주의하자.

##### cors 이슈

로스트아크 OpenAPI에서 제공하는 캐릭터 이미지 url은 캐릭터가 아바타를 착용하고 있지 않으면, null을 반환한다.

대신 공식 홈페이지의 전투정보실에 있는 이미지를 스크래핑해서 사용하려고 하는데, get 요청을 보낼 때 cors policy 에 걸렸다.

해결을 위해 next.js의 rewrites 기능을 config 파일에 설정한다.

##### prevent body scroll

메뉴바에 스크롤 기능을 적용했는데, 전체 바디의 스크롤이 같이 되는 문제가 생겼다.

문제는 메뉴바가 오픈소스 컴포넌트이기 때문에, 이벤트를 수정하기가 쉽지 않다. 분명 데몬 사이트에서는 문제가 없었는데, 무언가 세팅하면서 문제가 생긴 듯 하다.

데몬 사이트에선 아래의 함수를 훅으로 export 해서 사용한다.

```ts
const preventDefault = (ev: Event) => {
  if (ev.preventDefault) {
    ev.preventDefault();
  }
  ev.returnValue = false;
};

const enableBodyScroll = () => {
  document && document.removeEventListener("wheel", preventDefault, false);
};
const disableBodyScroll = () => {
  document &&
    document.addEventListener("wheel", preventDefault, {
      passive: false,
    });
};
```

왜인지 적용이 안돼서, 소스코드를 아래와 같이 수정했다.

```ts
function overflowSetter(position: string, overflow: string): void {
  document.documentElement.style.position = position;
  document.documentElement.style.overflow = overflow;
  document.body.style.position = position;
  document.body.style.overflow = overflow;
}
```

사용 방식은, 메뉴바의 `onMouseEnter`, `onMouseLeave` 이벤트에 따라 html과 body의 position, overflow 속성을 바꿔서 스크롤이 불가능한 상태로 만드는 것이다.

#### 캐릭터 조회창

기본적으로는 로스트아크 홈페이지의 전투정보실 시스템을 거의 똑같이 참조했다.

추가적인 점은 장비/악세서리 슬롯에 대략적인 정보를 미리 볼 수 있게 표시해준다는 점.

그리고 복잡한 문제가 하나 남아있는데, 바로 툴팁기능이다. 단순 툴팁이 아니라 장비나 악세서리의 툴팁에 해당 장비의 자세한 정보를 출력해주는 기능이다.

여기서 문제는 툴팁 자체를 어떻게 구현할 것인가, 그리고 openAPI의 제한적인 포맷을 어떻게 활용할 것인가이다.

1. 툴팁은 오픈소스 사용 ㅋ.ㅋ

- [`react-tooltip`](https://github.com/ReactTooltip/react-tooltip) 을 활용하여 툴팁기능 자체는 손쉽게 불러왔다.
- 이제 중요한 건 이 툴팁에 원하는 내용을 출력하는 것.

2. 제한적인 포맷

- Lostark openAPI의 응답데이터를 살펴본 결과, 바로 사용할 수 없는 문제점들이 몇가지가 있었다.
  1. 응답 데이터 자체는 툴팁에 그대로 사용하면 될 정도로 자세하게 들어가있었다.👍
  2. 문제는 응답 데이터에 들어간 포맷이, HTML 형태가 아니고, custom Component 형태로 들어가있다.
  - ex) `<FONT SIZE='12'><FONT COLOR='#A03823'>기본 효과</FONT></FONT>`
  3. 이런 형태의 데이터가 **문자열** 형태로 들어온다.
- 뭐 응답데이터의 포맷이 어떻게 되어있는지는 안알려줘도 대충 까보고 파악할 수 있긴하다. 근데 위의 문제점은 내가 직접 parsing function을 만들어야 했다.
- 처음 생각한 가능성들은 아래와 같다.
  1. 커스텀 태그 텍스트를 tagName 과 props 를 감지해서 직접 jsx element 로 만들어낸다.
  2. 정규식을 사용해서 하드코딩 text replace를 통해 수정한다

당연히 1번 방식이 확장성이 좋긴 하겠지만, Lostark 측의 응답 데이터 포맷이 실제로 게임 플레이해보면 알겠지만 그렇게 쉽게 바꾸리만한 것이 아니기 때문에, 간편하게 2번 방식으로 구현했다.

replace를 해도 결과값은 결국 text이기 때문에, text를 jsx로 파싱해줄 기능이 필요하다. 이것도 오픈소스를 사용했다 ㅋ.ㅋ

- [`html-react-parser`](https://www.npmjs.com/package/html-react-parser)

이제 결과적으로 내가 원하는 가장 기본적인 캐릭터 정보 출력 항목은 완성됐다.
