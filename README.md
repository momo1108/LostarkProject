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
EC2의 무료 인스턴스를 만들어놓은게 있었다.

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
> 종료하려면 `ps aux | grep node` 로 프로세스 ID 찾아내고(왼쪽에서 2번째),<br>
> `kill -9 프로세스ID` 하면 된다.

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
  apps : [{
    name   : "LoastarkApp",
    script : "npm start"
  }]
}
```
- 테스트해보기
```bash
pm2 start ecosystem.config.js # 서버 구동
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
    }
  }
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
}
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

[가비아](https://www.gabia.com/)에서 .site 도메인이 2000원에 판매되고있다. 이건 못참지.

loaple.site 로 사용하자.

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