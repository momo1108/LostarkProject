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
### 프로젝트 초기 설정
EC2의 무료 인스턴스를 만들어놓은게 있었다.

근데 보안 키 페어를 잃어버림 ㅠ....

어쩔수 없으니 복구해보자.

블로그 여기저기를 참조해서 방법을 알아보니 대개 아래의 과정으로 하더라.

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
  - 먼저 새 인스턴스 ssh 접속 : `ssh ubuntu@ip주소 -i key경로`
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

위 과정을 거쳐야한다... 파일 하나 읽어버린 대가치고는 좀 많이 귀찮다 ㅠ

다시는 잃어버리지 않게 프로젝트에 key 전용 폴더를 만들어서 보관하자.(⚠️ .gitignore 에 추가해놓기)

이미 서버에 nvm을 깔아놨다. 프로젝트를 clone 하고 그대로 빌드해보자.
```bash
git clone https://github.com/momo1108/LostarkProject.git
npm ci
npm run build
sudo service nginx stop # nginx 먼저 중지
npm start
```