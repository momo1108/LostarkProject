# 로스트아크 테스트 프로젝트

> 로스트아크 공식 open API를 활용한 테스트 프로젝트입니다.

## 개발 기술 스택

### Front-end

- react
- react-router
- redux
- Next.js

### Back-end

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

아이콘은 http://svgicons.sparkk.fr/ , https://iconsvg.xyz/ , https://feathericons.com/, https://www.svgrepo.com/ 을 참조.

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

당연히 1번 방식이 확장성이 좋긴 하겠지만, Lostark 측의 응답 데이터 포맷이 실제로 게임 플레이해보면 알겠지만 그렇게 쉽게 바뀔만한 것이 아니기 때문에, 간편하게 2번 방식으로 구현했다.

replace를 해도 결과값은 결국 text이기 때문에, text를 React element로 파싱해줄 기능이 필요하다. 이것도 오픈소스를 사용했다 ㅋ.ㅋ

- [`html-react-parser`](https://www.npmjs.com/package/html-react-parser)

이제 결과적으로 내가 원하는 가장 기본적인 캐릭터 정보 출력 항목은 완성됐다.

#### 폰트 설정 이슈

이 프로젝트에서 사용하는 폰트는 총 2가지로 정했다.

영어에 사용할 `Roboto`, 한글에 사용할 `NanumSquareNeo` 가 그 2가지가 되시겠다.

Google Fonts와 Naver에서 직접 다운로드 받아서 사용하는데, 바로 사용하기에는 용량이 너무 커서, woff 형식으로 변환해 용량을 최소화하기로 했다.

결과적으로 `NanumSquareNeo`는 Light, Regular, Bold, ExtraBold 4가지를 합쳐 `2.8MB` 정도이고, `Roboto`는 Light, Regular, Bold 3가지를 합쳐 `212KB` 이다.

나눔스퀘어네오는 최근에 나온 폰트라서 한번 써봤는데, 용량을 줄여도 정말 오질라고 크다.

이제 글꼴 적용을 위해, 처음에 사용하던 방법은 `globals.scss`에 직접 `font-face`를 지정해주는 방식을 사용했다.

```scss
@font-face {
  font-family: "NanumSquareNeo";
  src: url("../fonts/NanumSquareNeo/NanumSquareNeo-aLt.woff") format("woff");
  font-weight: 300;
  font-style: normal;
}
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
  src: url("../fonts/NanumSquareNeo/NanumSquareNeo-dEb.woff") format("woff");
  font-weight: 800;
  font-style: normal;
}
@font-face {
  font-family: "Roboto";
  src: url("../fonts/Roboto/Roboto-Light.woff") format("woff");
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

html {
  font-family: "Roboto", "NanumSquareNeo", sans-serif;
}
```

물론 잘 적용이 되긴 하지만, 문제점을 하나 발견했다.

**페이지가 렌더 된 후에 폰트가 로딩이 된다는 점이다.**

다시말해서 폰트가 preloading이 되지 않는다. 페이지를 연 후에 텍스트가 로딩되고 나서 글꼴이 바뀌는게 눈에 보이는 순간 정말 허접해 보여서 자존심이 상하더라....😂

문제를 해결할때에는 역시 [`Document`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts)를 봐야한다.

역시나 Next.js 에서는 폰트 관련 기능들도 제공해주고 있었다. 👍

##### 기본 사용법

여차저차 해석을 해보니, Next.js 에서는 브라우저에서 따로 요청을 보내는 일 없이 배포한 도메인 자체에서 Google Fonts를 제공받을 수 있다고 한다.

기본적은 사용법은 아래와 같으며, Next.js 에서는 `variable fonts`의 사용을 권장하고 있다.

```js
import { Inter } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}
```

##### Local Fonts

내 경우에는 local 환경에 직접 다운로드 받아서 사용하기 때문에, 이를 위한 다른 방법이 제공된다.

`next/font/local` 를 사용해, 직접 폰트 경로를 지정해서 사용할 수 있다. Document의 예시는 아래와 같다.

```js
import localFont from "next/font/local";

const roboto = localFont({
  src: [
    {
      path: "./Roboto-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Roboto-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Roboto-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Roboto-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={roboto.className}>
      <Component {...pageProps} />
    </main>
  );
}
```

다만 내 프로젝트는 TypeScript 환경의 최신버전의 Next.js와 Redux까지 사용하기 때문에, `_app.js` 구성이 조금 다르다.

그 외에 Tailwind와의 호환방식도 있는데, `tailwind.config.js` 를 수정하다가 충돌이 났는지, scss 변수가 먹통이 되는 이슈가 발생했다. 그냥 기본 사용 방식으로 쓰기로 했다. 🥹

어쨌든 위의 방식처럼 font function이 페이지에서 호출되면, 글로벌하게 모든 routes에 사용할 수 있는게 아니라, 해당 페이지와 관련된 routes 에서만 preload가 된다.

따라서 위의 방식은 Single Page에서 사용하는 방법이다. Font를 다른 페이지에서도 재활용하기 위해서는 어떻게 해야할까?

##### Reusing Fonts

Next.js에서 제공하는 `localFont`, Google font 함수를 실행하면, 해당 폰트는 application의 하나의 instance 에서만 host된다.

따라서 같은 폰트를 여러 파일에서 함수를 호출해 사용할 경우, 같은 폰트에 대해서 여러개의 instance가 host된다. 따라서 아래와 같은 방식을 추천하더라.

1. 하나의 공유 파일에서 font loader 함수를 실행한다.
2. constant로서 export한다.
3. 그 constant를 내가 사용하고 싶은 파일에서 import 한다.

드디어 허접한 폰트로딩을 벗어나 제대로된 preloading을 사용하게 되었도다. 시크릿탭을 사용해서 접속을 해봐도, 새로고침을 무한반복 해봐도 폰트가 변화하면서 생기던 울렁거림이 보이지 않는것을 보니 속이 다 시원하다.

- /types/GlobalType.ts

```ts
import localFont from "next/font/local";

export const roboto = localFont({
  src: [
    {
      path: "../fonts/Roboto/Roboto-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Roboto/Roboto-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Roboto/Roboto-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
});

export const nanumNeo = localFont({
  src: [
    {
      path: "../fonts/NanumSquareNeo/NanumSquareNeo-aLt.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/NanumSquareNeo/NanumSquareNeo-bRg.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/NanumSquareNeo/NanumSquareNeo-cBd.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/NanumSquareNeo/NanumSquareNeo-dEb.woff",
      weight: "800",
      style: "normal",
    },
  ],
});
```

설정 후 크롬 브라우저 개발자 도구에 Network탭을 통해 확인해보니, 메인페이지에서 import 코드를 넣고 실행하면 페이지로딩 시 내가 설정한 7개의 woff 파일이 로딩되는 것을 확인했다..(개수는 맞으니까 맞겠지?)

다른 페이지로 이동을 해도 다시 로딩이 되지 않는것을 보니, 제대로 reusing이 되고 있다고 판단된다. 끝!

인줄 알았으나, 또다른 문제 발견....

이게 개발서버 환경과 빌드된 서버 환경에서 동작이 다르다. 왜그런지 원인은 모르겠지만, 개발서버에서는 7개의 폰트 모두 불러오는데 빌드된 서버에서는 정확하게 import해서 사용된 폰트만 불러와진다.(사실 이게 맞지)

근데 이게 next router로 push할때에는 해당 페이지에 대해 preloading이 동작하지 않는다. 따라서 사용할 폰트를 최상위 페이지에서 import를 하는게 맞는 것 같은데...

요것저것 건들다가 `_app.tsx` 의 `<Component>`에 className을 갖다 넣었더니 잘 되는 것 같다.

라고 생각했으나, 인덱스 페이지가 아닌 경로로 바로 들어가버리니 또 이게 안된다 🤬🤬🤬🤬

어차피 이렇게 접속하는 경우는 많지 않으니 그냥 사용하자.

#### Lazy Loading

개발서버에서 페이지 로딩 시간이 가끔 오래걸리는 경우가 생기는걸 확인했다.

개발자 도구로 살펴보니, 메인 js파일이 로드되고 나서 페이지가 렌더링되는데 그 크기가 무려 1.2MB!

Lazy Loading을 적용하면 특정 경로의 페이지 렌더링에 필요한 JS의 양을 줄여서 처음 접속시 로딩속도를 향상시켜준다.

Lazy Loading으로 import 된 라이브러리나 Client Components의 로딩을 연기시킬 수 있고, 필요한 경우에만 client bundle에 포함시킬 수 있다.(ex. modal을 클릭할때까지 로딩을 연기시킨다.)

사용 방법은 2가지가 있다.

1. `next/dynamic`의 [**Dynamic Imports**](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#nextdynamic) 를 사용한 방법
2. [**`<Suspense>`**](https://react.dev/reference/react/Suspense) 컴포넌트와 [`React.lazy()`](https://react.dev/reference/react/lazy) 를 사용한 방법

근데 빌드서버를 사용하니까 알아서 code split이 되네 🤣

기타 optimizing은 여기서 참조 (https://nextjs.org/docs/pages/building-your-application/optimizing)

#### Redux 관련 이슈

useDispatch 훅을 사용해 컴포넌트 내에서 action을 실행시킬 때, 컨테이너 컴포넌트와 프레젠테이션 컴포넌트 중 어디에서 실행하냐에 따라 실행 결과가 달라졌다.
컨테이너에서 실행할 경우 원인을 알수없는 data 초기화가 일어났다.

#### AWS EC2 Region 이전(23/05/31)

현재 사용하던 서버에 웹서버를 띄우고 테스트를 해보면 이상하게 네트워크가 느린걸 몇번 느꼈다.

일단은 그냥 넘어갔었는데, 오늘 원인을 불현듯 떠올렸다.

서버 인스턴스의 사양이 달라진다고 네트워크 속도가 달리지진 않을테니까 원인은 서버사양이 아니라 서버의 Region이 되시겠다.

아무생각없이 사용하던 서버가 대쉬보드를 확인해보니 미국 동부 버지니아 주에 위치한 서버였다...😂

바로 이미지를 복사해서 서울 Region으로 다시 서버를 만들려했으나, 이미지 복사가 오래걸리는 모양인지 서버 사양 선택이 안되더라.

기다리기 싫어서 그냥 제로세팅부터 다시 설정했다.

결과는 믿을수 없을 정도로 빨라진 초기 로딩 속도가 증명해줬다. 한국 서버 만세!

---

툴팁 위치를 옮기는 대작업을 해야한다.(완료)
특성/성향 모달로 출력기능(직접 출력으로 수정)
아이디내 캐릭터 보기
순위는 어떻게 했을까?
차트라이브러리 혹시라도 참조(charjs - https://react-chartjs-2.js.org/)

seo - next-seo 라이브러리 참조.

useEffect 내부에서 api 요청을 보낼 때 주의 - https://www.youtube.com/watch?v=QQYeipc_cik

#### 각인세팅

검색기능부터 구현해야 한다.

최소 세팅 비용을 구하기 위한 알고리즘을 짜야한다.

먼저 필요한 각인에 맞게 검색을 하는 방법부터 구상하자.

기본적인 검색 파라미터는 아래와 같다.

```js
RequestAuctionItems{
  ItemLevelMin	integer($int32)
  ItemLevelMax	integer($int32)
  ItemGradeQuality	integer($int32), default: null
  SkillOptions	[SearchDetailOption{
    FirstOption	integer($int32), default: null
    SecondOption	integer($int32), default: null
    MinValue	integer($int32), default: null
    MaxValue	integer($int32), default: null
  }]
  EtcOptions	[SearchDetailOption{
    FirstOption	integer($int32), default: null
    SecondOption	integer($int32), default: null
    MinValue	integer($int32), default: null
    MaxValue	integer($int32), default: null
  }]
  Sort	string(Enum: [ BIDSTART_PRICE, BUY_PRICE, EXPIREDATE, ITEM_GRADE, ITEM_LEVEL, ITEM_QUALITY ])
  CategoryCode	integer($int32)
  CharacterClass	string
  ItemTier	integer($int32), default: null
  ItemGrade	string
  ItemName	string
  PageNo	integer($int32)
  SortCondition	string(Enum: [ ASC, DESC ])
}
```

자세한 검색조건은 apirequest.json 을 참조.

- EtcOptions
  - FirstOption : 대분류(2:전투 특성, 3:각인 효과, 6:감소 효과, 5:팔지 특수 효과, 4:팔찌 옵션 수량)
  - Categories : 종류
  ```json
  [
    {
      "Subs": [
        {
          "Code": 170300,
          "CodeName": "아뮬렛"
        },
        {
          "Code": 180000,
          "CodeName": "무기"
        },
        {
          "Code": 190010,
          "CodeName": "투구"
        },
        {
          "Code": 190020,
          "CodeName": "상의"
        },
        {
          "Code": 190030,
          "CodeName": "하의"
        },
        {
          "Code": 190040,
          "CodeName": "장갑"
        },
        {
          "Code": 190050,
          "CodeName": "어깨"
        }
      ],
      "Code": 10000,
      "CodeName": "장비"
    },
    {
      "Subs": [],
      "Code": 30000,
      "CodeName": "어빌리티 스톤"
    },
    {
      "Subs": [
        {
          "Code": 200010,
          "CodeName": "목걸이"
        },
        {
          "Code": 200020,
          "CodeName": "귀걸이"
        },
        {
          "Code": 200030,
          "CodeName": "반지"
        },
        {
          "Code": 200040,
          "CodeName": "팔찌"
        }
      ],
      "Code": 200000,
      "CodeName": "장신구"
    },
    {
      "Subs": [],
      "Code": 210000,
      "CodeName": "보석"
    }
  ]
  ```

icepeng의 검색을 참조해보니 아래와 같다.

```json
{
  "CategoryCode": 200010,
  "Sort": "BUY_PRICE",
  "SortCondition": "ASC",
  "ItemTier": 3,
  "ItemGrade": "고대",
  "ItemGradeQuality": 50,
  "EtcOptions": [
    { "FirstOption": 2, "SecondOption": 15, "MinValue": 0 },
    { "FirstOption": 2, "SecondOption": 16, "MinValue": 0 },
    { "FirstOption": 3, "SecondOption": 118, "MinValue": 3 },
    { "FirstOption": 3, "SecondOption": 141, "MinValue": 3 }
  ],
  "PageNo": 1
}
```

```json
{
  "CategoryCode": 200020,
  "Sort": "BUY_PRICE",
  "SortCondition": "ASC",
  "ItemTier": 3,
  "ItemGrade": "고대",
  "ItemGradeQuality": 50,
  "EtcOptions": [
    { "FirstOption": 2, "SecondOption": 15, "MinValue": 0 },
    { "FirstOption": 2, "SecondOption": "", "MinValue": 0 },
    { "FirstOption": 3, "SecondOption": 118, "MinValue": 3 },
    { "FirstOption": 3, "SecondOption": 141, "MinValue": 3 }
  ],
  "PageNo": 1
}
```

```json
{
  "CategoryCode": 200020,
  "Sort": "BUY_PRICE",
  "SortCondition": "ASC",
  "ItemTier": 3,
  "ItemGrade": "고대",
  "ItemGradeQuality": 50,
  "EtcOptions": [
    { "FirstOption": 2, "SecondOption": 16, "MinValue": 0 },
    { "FirstOption": 2, "SecondOption": "", "MinValue": 0 },
    { "FirstOption": 3, "SecondOption": 118, "MinValue": 3 },
    { "FirstOption": 3, "SecondOption": 141, "MinValue": 3 }
  ],
  "PageNo": 1
}
```

1. 전투 특성에 맞게 검색을 한다.

- 목걸이의 경우에는 특성 고정.
- 귀걸이, 반지같은 경우 2가지 특성을 사용하는 경우가 존재.
  - 각각의 특성에 대해서 같은 조건으로 검색을 진행

2. 각인(고민이 필요)

- 각인서와 어빌리티스톤의 수치를 제외한 값을 구한다.
- 각인을 만족시킬 5개의 악세서리 각인 조합을 구해야한다.
  1. greedy
  - 필요한 각인들의 수치를 크기순으로 정렬한다.
  - 가장 큰 수치의 각인과 가장 낮은 수치의 각인에 한 악세서리 각인수치를 적용한다.
  - 적용 후의 수치를 다시 크기순으로 정렬한다.
  - 위 2 과정을 모든 각인을 채울 때 까지 반복한다.
  - (큰 수치의 각인에 적용 시 남은 값이 3 미만일 경우, 큰 수치에 적용할 각인의 최소값을 적용 후 남은 값이 3이 되도록 조정한다.)
  2. 완탐
  - (3, 3), (3, 4), (3, 5), (3, 6) 의 조합으로 가능한 조합을 모두 찾는다.
  - 5개의 악세서리 각각에 위 4가지 조합 \* (각인들 중 택2 - nP₂ )을 가정.
  - 총 경우의 수 - (4 \* 6! / 4!)^5 = 120^5 = 248억;;
  - 가지치기를 하면 줄긴 하겠지만 그래도 너무 많다.

각인은 1번 방식으로 결정.
고민사항

```
포인트가 남은 각인목록 중 2개를 선택
선택한 경우에 대해 7가지의 경우를 적용
6,3 / 5,3 / 4,3 / 3,3 / 3,4 / 3,5 / 3,6

최대 경우의 수
(2Cn * 7)^5

6! / 4! 2! = 15

(15 * 7) ^ 5 = 127억6281만5625

입력형태 {name:string, point:number}[]

2가지를 고르는 함수 pickTwo
경우의수가 너무 많기 때문에,

5가지의 악세서리에 대해 pickTwo를 사용하며 필터링해줄 함수 findCombination

for i
for j
for case
rec(data, count

3번 가지치기 경우의 수
i	j	least needcount
0	+	2
+	0	2
0	0	1

i 가 0인 경우

j 가 0인 경우
```

```ts
interface Accessory {
  종류: string;
  특성: {
    특성종류: string;
    종류: string;
    값: number;
  }[];
}

function findValidCombination(): Accessory[] | null {
  const necklaces: Accessory[] = [
    {
      종류: "목걸이",
      특성: [
        { 특성종류: "전투특성", 종류: "치", 값: 450 },
        { 특성종류: "전투특성", 종류: "특", 값: 460 },
        { 특성종류: "각인특성", 종류: "e1", 값: 6 },
        { 특성종류: "각인특성", 종류: "e3", 값: 3 },
        { 특성종류: "페널티특성", 전투특성종류: "p2", 값: 2 },
      ],
    },
    // 다른 목걸이들의 조합도 추가할 수 있습니다.
  ];

  const earrings: Accessory[] = [
    {
      종류: "귀걸이",
      특성: [
        { 특성종류: "전투특성", 종류: "치", 값: 200 },
        { 특성종류: "각인특성", 종류: "e2", 값: 4 },
        { 특성종류: "각인특성", 종류: "e4", 값: 5 },
        { 특성종류: "페널티특성", 전투특성종류: "p1", 값: 1 },
      ],
    },
    // 다른 귀걸이들의 조합도 추가할 수 있습니다.
  ];

  const rings: Accessory[] = [
    {
      종류: "반지",
      특성: [
        { 특성종류: "전투특성", 종류: "신", 값: 150 },
        { 특성종류: "각인특성", 종류: "e5", 값: 3 },
        { 특성종류: "각인특성", 종류: "e6", 값: 6 },
        { 특성종류: "페널티특성", 전투특성종류: "p3", 값: 3 },
      ],
    },
    // 다른 반지들의 조합도 추가할 수 있습니다.
  ];

  let validCombination: Accessory[] | null = null;

  // 가능한 조합 찾기
  for (const necklace of necklaces) {
    for (const earring1 of earrings) {
      for (const earring2 of earrings) {
        for (const ring1 of rings) {
          for (const ring2 of rings) {
            const combination: Accessory[] = [
              necklace,
              earring1,
              earring2,
              ring1,
              ring2,
            ];
            const battleStats: string[] = [];
            const engravings: string[] = [];
            let penaltyTotal = 0;

            for (const accessory of combination) {
              for (const attribute of accessory.특성) {
                if (attribute.특성종류 === "전투특성") {
                  battleStats.push(attribute.종류);
                } else if (attribute.특성종류 === "각인특성") {
                  engravings.push(attribute.종류);
                } else if (attribute.특성종류 === "페널티특성") {
                  penaltyTotal += attribute.값;
                }
              }
            }

            // 원하는 전투특성의 종류별 최소값 이상을 가지는지 확인
            if (
              battleStats.includes("치") &&
              battleStats.includes("특") &&
              battleStats.includes("신") &&
              battleStats.includes("제") &&
              battleStats.includes("인") &&
              battleStats.includes("숙")
            ) {
              // 각인특성의 종류별 최소값 이상을 가지는지 확인
              if (
                engravings.includes("e1") &&
                engravings.includes("e2") &&
                engravings.includes("e3") &&
                engravings.includes("e4") &&
                engravings.includes("e5") &&
                engravings.includes("e6")
              ) {
                // 모든 페널티특성의 합이 5 미만인지 확인
                if (penaltyTotal < 5) {
                  validCombination = combination;
                  break;
                }
              }
            }
          }
          if (validCombination !== null) break;
        }
        if (validCombination !== null) break;
      }
      if (validCombination !== null) break;
    }
    if (validCombination !== null) break;
  }

  return validCombination;
}

// 가능한 조합 찾기
const validCombination = findValidCombination();

if (validCombination !== null) {
  console.log("조합을 찾았습니다.");
  validCombination.forEach((accessory) => {
    console.log(`${accessory.종류}:`);
    accessory.특성.forEach((attribute) => {
      console.log(
        `${attribute.특성종류} - 종류: ${attribute.종류}, 값: ${attribute.값}`
      );
    });
  });
} else {
  console.log("조건을 만족하는 조합이 없습니다.");
}
```

테두리

- https://pixabay.com/vectors/abstract-art-border-frame-1861373/
- https://pixabay.com/vectors/vintage-frame-line-art-antique-old-5331242/

#### 모달

모달 설정 시 고민한 부분

- 컴포넌트 트리 구조가 복잡한 경우, 어떻게 모달 state 설정을 할 것인가?
  - Redux를 이용한 설정
  - [createPortal](https://react.dev/reference/react-dom/createPortal#createportal)

액션과 디스패치 등등 여러 설정이 필요한 Redux보단 간단하게 createPortal을 사용해 보기로 결정.

```js
createPortal(children, domNode, key?)
```

##### Parameters

- child : React로 렌더될 수 있는 것이라면 아무거나.(JSX 요소-`<div />`, `<SomeComponent />`, Fragment, 문자열, 숫자, 그리고 이런것들의 배열)
- domNode : `document.getElementById()`로 리턴되는 것과 같은 특정 DOM node. 이 Node는 미리 존재해야 한다. update 도중에 또다른 DOM node를 전달하는 것은 portal content의 재생성을 유발한다.
- key(optional) : portal의 key로 사용될 유일 문자열 or 숫자.

##### Returns

React Node : JSX 혹은 React Component 의 return 값에 해당하는 노드. React가 render output에서 해당 값을 마주치면, `children` 파라미터를 `domNode` 파라미터에 위치시킨다.

참조 : React Document(https://react.dev/reference/react-dom/createPortal#createportal)

#### React Hook 실수들

- https://www.youtube.com/watch?v=GGo3MVBFr1A

#### Todo

- 각인 CSS
  - 배경찾기
- 각인 검색 보유악세
- 각인 검색 유물등급(섞는 경우?)
- 각인 검색 같은 특성 O
- 각인 검색 진행중 표시(왜 멈출까? 싱글 스레드라서. web-worker 사용해보자.)(참조 - https://www.youtube.com/watch?v=Gcp7triXFjg) O
- 결과 필터링
- 일단 checkPositive 를 5개가 완성됐을 때 체크하는것으로 수정 후 결과 확인
- 5개 고르기 전에 미리 완성되는 경우에 어떻게 할지(필요없을듯)
- 필터(특성), 페이지별 개수
- 필터링시 팁 집어넣기
  - 초반에는 모든 조합을 확인하기 때문에 오래걸리고, 후반갈수록 급격히 빨라짐
  - 품질에 비해 특성합을 너무 높게 설정하면, 필터링에 맞는 조합을 찾는데 더욱 오래걸린다.
- apiKey 발급 안내페이지
- api검색도 webworker로 분리하기
- api검색 or 필터링 취소?
