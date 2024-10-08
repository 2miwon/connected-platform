# 커넥티드플랫폼 팀과제 README

# 2024-1 yonsei X LG WebOS connected platform project

## Team 6 Introduce

---

- **Hojae Lee (Computer Science 18.5)**

Frontend / Android Developer

[https://github.com/unikskyseed](https://github.com/unikskyseed)

- **Heewon Lim (Computer Science 19)**

Backend / DB Developer

[https://github.com/2miwon](https://github.com/2miwon)

[https://www.linkedin.com/in/2miwon/](https://www.linkedin.com/in/2miwon/)

## **Project Description**

---

We decided to develop on (1) Media Web Application for this '24 Spring Project.

저희는 Coursera, LearnUS와 같이 언제 어디서나 대학 강의를 들을 수 있는 대규모 온라인 공개강좌(MOOC) 플랫폼 서비스를목적으로 WebOS 어플리케이션을 제작하였습니다.

1. 교육 접근성 향상
    
    스마트TV를 활용하여 시간과 장소에 구애받지 않고 대학 강의를 수강할 수 있습니다.
    
    일반 PC나 모바일 기기 외에 대형 스크린을 통해 보다 몰입감 있는 학습 경험을 제공합니다.
    
2. 편리한 학습 환경 조성
    
    리모컨(안드로이드 어플리케이션)만으로도 강의 재생, pause, 되감기 등의 기본 기능을 손쉽게 제어할 수 있기 때문에 기존 TV 시청 습관에 익숙한 사용자들도 쉽게 학습 콘텐츠에 접근할 수 있습니다.
    
3. 교육 콘텐츠 확장성
    
    기존 온라인 강의 외에도 방송 자료, 다큐멘터리 등 다양한 교육 자료를 활용할 수 있습니다.
    

⇒ WebOS 환경에 최적화된 교육 콘텐츠 플랫폼를 제작하여 서비스 경쟁력을 높일 수 있습니다.

## Functional Specification

---

- enact 사용설명서
    
    ```bash
    ares-setup-device # TV 와 연결을 시킨다.
    
    ares-novacom -d (tv이름) -getkey #CLI 사용하여 PC-TV 연결
    #TV Developer mode 앱에 있는 Passphrase 값을 터미널에 입력
    
    npm run build
    
    ares-package ./dist # 앱 패키징
    
    ares-install com.app.mooc-streaming_1.0.0_all.ipk # 앱 설치
    
    ares-launch com.app.mooc-streaming_1.0.0_all.ipk # 앱 실행
    ```
    
    - Enact.js를 사용하는 방법
    
    ```jsx
    npm install -g @enact/cli # 개발 환경 설정을 해준다
    
    enact create my_app # enact CLI 를 사용하여 새 프로젝트를 생성합니다.
    
    cd to_project_file # 프로젝트 디렉티리로 이동한다
    
    enact serve / enact run serve # 개발 서버 실행을 시킨다
    # 애플리케이션을 미리 보기 위해 개발 서버를 시작합니다.
    
    ```
    

## Our **Solution**

---

![Untitled](https://file.notion.so/f/f/9efa1ade-d525-423c-adbf-407a21b2f03f/df236d39-29bc-4512-98f5-81322fd870ae/Untitled.png?id=c2556b65-7b3c-4344-8179-501fb42feded&table=block&spaceId=9efa1ade-d525-423c-adbf-407a21b2f03f&expirationTimestamp=1718049600000&signature=yam8UpTgq-qhJqe6uk4JP7F11UsTkw9ihfZKuaSEHmo&downloadName=Untitled.png)

### Frontend - Enact.js WebOS application

---

Enact.js는 LG에서 개발한 웹OS 애플리케이션을 구축하기 위한 JavaScript 프레임워크입니다. React를 기반으로 하여 React의 컴포넌트 기반 아키텍처의 장점을 활용하면서, 웹OS에 특화된 추가 도구와 라이브러리를 제공합니다.

Enact.js의 주요 특징

1. **컴포넌트 기반 아키텍처:** Enact.js는 React처럼 컴포넌트 기반 아키텍처를 사용하여 코드의 재사용성과 유지 보수성을 높입니다. 컴포넌트는 모듈화되어 쉽게 관리하고 테스트할 수 있습니다. 작은 단위의 컴포넌트로 분리된 코드는 테스트와 디버깅이 용이합니다. 
2. **가상 DOM:** React의 가상 DOM은 UI 업데이트를 효율적으로 처리하여 성능을 최적화합니다.
3. **향상된 UI 컴포넌트**: Enact.js는 TV 및 대화면 환경에 맞춘 다양한 사전 구축된 UI 컴포넌트를 제공합니다. 이러한 컴포넌트는 성능과 사용성을 최적화하여 10피트 사용자 인터페이스 환경에서 잘 작동합니다.
4. **테마 및 커스터마이제이션**: Enact.js는 테마 및 커스터마이제이션을 지원하여 일관되고 시각적으로 매력적인 사용자 인터페이스를 쉽게 스타일링하고 테마를 적용할 수 있습니다.
5. **접근성**: 프레임워크에는 접근성 표준을 준수하는 애플리케이션을 만들 수 있도록 돕는 기능이 포함되어 있습니다.
6. **개발자 도구 및 CLI:** Enact.js는 개발 프로세스를 간소화하는 커맨드 라인 인터페이스(CLI)를 제공하며, 프로젝트 생성, 빌드 및 애플리케이션 서빙 명령을 제공합니다. 또한, 인기 있는 개발 도구와 통합되어 디버깅 및 테스트 유틸리티를 제공합니다.

### 주요 기능 사용 ( **Enact.js framework Sandstone Library** )

**Sandstone Library:** LG의 최신 UI 라이브러리로, 더 세련되고 현대적인 UI 컴포넌트들을 사용했습니다. 주로 LG의 최신 스마트 TV와 같은 대형 화면 디바이스를 위한 사용자 인터페이스를 구축하기 위해 설계되었습니다. 

주로 사용했던 컴퍼넌트들은 다음과 같습니다:

1. Button
2. Input
3. Popup
4. VideoPlayer
5. TabLayout
6. MediaOverlay
7. Alert

enact의 어떤 기능들을 사용하였고 enact의 장점들을 소개

### Backend: Golang Fiber Framework

---

- **Why Golang Why Fiber framework**
    
    [https://web-frameworks-benchmark.netlify.app/](https://web-frameworks-benchmark.netlify.app/)
    
    UDP는 연결 지향적이지 않고 비신뢰성 프로토콜이기 때문에 미션 크리티컬한 영역에는 적합하지 않습니다. 하지만 동영상 스트리밍과 같이 실시간성과 데이터 전송률이 중요한 서비스
    
    실시간 스트리밍 데이터 전송에 있어 낮은 지연 시간이 중요합니다.
    
    UDP는 연결 설정, 혼잡 제어, 재전송 등의 부담이 없어 전송률이 높습니다.
    
    동영상 스트리밍에서는 약간의 패킷 손실이 허용될 수 있습니다.
    
    동영상 스트리밍 서비스는 실시간으로 대용량 데이터를 전송하고 이용자에게 매끄러운 시청 경험을 제공해야 합니다. 이를 위해 Golang의 오픈소스 백엔드 프레임워크인 Fiber를 사용하였고 다음과 같은 장점을 활용하고 있습니다.
    
    1. **Fiber는 높은 Requests/Second (RPS) 지표를 보여줍니다.**
        
        ![Untitled](https://file.notion.so/f/f/9efa1ade-d525-423c-adbf-407a21b2f03f/c8ed7f1f-7e28-4bce-8d87-4f8969788ac7/Untitled.png?id=437b2d09-0445-4ca8-8a9c-7bea49c7c731&table=block&spaceId=9efa1ade-d525-423c-adbf-407a21b2f03f&expirationTimestamp=1718049600000&signature=wpgTRWRdNyssmu_rf7s1QC_Do0InREA7XU3IBu8Jwpc&downloadName=Untitled.png)
        
        - 많은 동시 접속자의 요청을 원활히 처리할 수 있습니다.
        - 대규모 라이브 스트리밍 시청자 트래픽을 수용할 수 있습니다.
        - 초기 버퍼링 시간을 최소화하여 빠른 재생 시작이 가능합니다.
        - Fiber는 Go 언어의 고성능과 병렬 처리 능력을 극대화하여 대용량 동영상 스트리밍에 적합합니다.
    2. **Fiber은 낮은 Latency (지연 시간) 지표를 보여줍니다.**
        
        ![Untitled](https://file.notion.so/f/f/9efa1ade-d525-423c-adbf-407a21b2f03f/885baa13-b490-41bd-80a2-2749388cdcd4/Untitled.png?id=f2ccd66d-d73a-4a72-883d-8b43464c0a84&table=block&spaceId=9efa1ade-d525-423c-adbf-407a21b2f03f&expirationTimestamp=1718049600000&signature=Qq3xlLDCNGh8VLH_m2Tsc-Oes4mS52GlA_VgRYarAlk&downloadName=Untitled.png)
        
        - P99.999 Latency는 100,000번중에 1번을 제외하고 모든 경우에서 해당 ms 미만의 Latency가 보장될수 있다는 지표입니다.
        - 높은 백분위의 지연 시간이 짧을 수록 대부분의 사용자에게 원활한 UX를 보장합니다.
        - **실시간 스트리밍 데이터 전송 시 끊김 없는 재생이 가능합니다.**
        - 사용자 인터렉션 (재생/일시정지/탐색 등)에 대한 빠른 응답 시간을 제공합니다.
        - Fiber의 미들웨어 구조를 활용하여 네트워크 상태 모니터링, 품질 조절 기능을 유연하게 구현할 수 있습니다.
    3. **Fiber은 낮은 Average Latency (평균 지연 시간) 지표를 보여줍니다.**
        
        ![Untitled](https://file.notion.so/f/f/9efa1ade-d525-423c-adbf-407a21b2f03f/74fab576-c8e5-4a2a-b38d-301ae4c1aaa1/Untitled.png?id=29d5f207-30d5-4e02-94c3-929b7671ae4c&table=block&spaceId=9efa1ade-d525-423c-adbf-407a21b2f03f&expirationTimestamp=1718049600000&signature=l8nWtV1mycRnVpcrhB22F69vJ9rEqXiZUKd5pliBHEY&downloadName=Untitled.png)
        
        - 전반적으로 매끄러운 스트리밍 경험을 제공할 수 있습니다.
        - **대기 시간이 짧아 사용자 이탈률을 낮출 수 있습니다.**
        - 안정적인 라이브 스트리밍 시청이 가능합니다.
        - Fiber에서는 사용자의 네트워크 환경에 맞춰 동영상 품질을 동적으로 조절할 수 있는 기능을 빠르게 구현할 수 있습니다.
    4. **Fiber은  안정적인 Minimum/Maximum Latency (최소/최대 지연) 지표를 보여줍니다.**
        
        ![Untitled](https://file.notion.so/f/f/9efa1ade-d525-423c-adbf-407a21b2f03f/d3a796e6-6d00-4eb7-b372-0818cd10d2ca/Untitled.png?id=b71bb5b5-8458-4014-b9c0-0d88950adafc&table=block&spaceId=9efa1ade-d525-423c-adbf-407a21b2f03f&expirationTimestamp=1718049600000&signature=uSxFNkBRWiovhAwweJ0yfG5ik8DAcK3XlXZWrzdbT6s&downloadName=Untitled.png)
        
        ![Untitled](https://file.notion.so/f/f/9efa1ade-d525-423c-adbf-407a21b2f03f/a49d99ed-1a3f-4bb8-b2fe-a7c99563f1fd/Untitled.png?id=6742d670-3b8a-40de-b539-7bc9798adcb2&table=block&spaceId=9efa1ade-d525-423c-adbf-407a21b2f03f&expirationTimestamp=1718049600000&signature=DjG0Vxi2X9QX1-xiXFIru6BNb-UeVdrfraCUGY-b-dM&downloadName=Untitled.png)
        
        - 동영상 데이터는 연속적으로 전송되어야 하므로 네트워크 연결이 안정적이어야 합니다.
        - **Maximum Latency가 낮으므로 일정한 품질의 스트리밍 서비스를 제공할 수 있습니다.**
        - **네트워크 환경 변화에도 비교적 영향을 적게 받습니다.**
        - → 지연 시간 변동폭이 작아 버퍼링 현상이 최소화됩니다.
        - Fiber는 효율적인 HTTP 핸들링과 고루틴 기반의 동시성 처리로 안정적인 데이터 전송을 지원합니다.
    5. **기타**
        - **확장성 -** Fiber의 모듈화된 구조와 간결한 코드 베이스는 서비스 확장에 용이합니다.
        - **보안 -** Fiber는 다양한 인증 및 보안 미들웨어를 지원하여 보안 요구사항을 충족할 수 있습니다.
        - **배포 -** Go 언어로 작성된 Fiber 애플리케이션은 단일 바이너리로 컴파일되어 다양한 환경에 손쉽게 배포할 수 있습니다.
        - **적응형 비트레이트 스트리밍 -** 사용자의 네트워크 환경에 맞춰 동영상 품질을 동적으로 조절해야 합니다.
    
    이처럼 높은 RPS와 낮고 안정적인 지연 시간은 동영상 스트리밍 서비스의 핵심 요구사항입니다. Go와 Fiber는 이러한 지표에서 우수한 성능을 발휘하여 대용량 트래픽 처리, 실시간 데이터 전송, 원활한 사용자 경험을 제공할 수 있습니다. 결과적으로 안정적이고 매끄러운 동영상 스트리밍 서비스를 구현할 수 있습니다.
    
    ⇒ Fiber는 동영상 스트리밍 서비스에 필요한 고성능, 안정성, 확장성, 보안성 등의 요구사항을 충족시키기에 적합한 프레임워크입니다.
    

- **Swagger를 이용한 API Docs 생성**

Swagger는 RESTful API를 설계, 문서화, 테스트 및 시각화하는 데 널리 사용되는 오픈 소스 도구입니다. Backend에서 Swagger를 사용하면 다음과 같은 장점이 있습니다.

1. **API 문서 자동 생성**
    - 수동으로 문서를 작성하고 유지 관리하는 노력을 줄일 수 있습니다.
    - 코드와 문서의 불일치를 방지할 수 있습니다.
2. **API 정의 및 표준화**
    - OpenAPI 규격을 통해 API를 정의하고 표준화할 수 있습니다.
    - 팀원들이 API를 쉽게 이해하고 사용할 수 있습니다.
    - API 변경 사항을 문서에 반영하여 버전 관리가 용이합니다.
3. **시각적 문서 제공**
    - Swagger UI를 통해 API 문서를 시각적으로 렌더링할 수 있습니다.
    - API의 엔드포인트, 파라미터, 응답 형식 등을 직관적으로 확인할 수 있습니다.
    - API 테스트와 실행이 가능한 대화형 인터페이스를 제공합니다.
4. **API 통합 테스트**
    - Swagger는 API 스펙을 기반으로 통합 테스트를 자동으로 생성할 수 있습니다.
    - 이를 통해 API의 정확성과 일관성을 검증할 수 있습니다.
    - 새로운 기능 추가 시 API 호환성을 확인할 수 있습니다.
5. **API 모니터링 및 분석**
    - Swagger와 연계된 모니터링 도구를 사용하면 API 사용 현황과 성능을 모니터링할 수 있습니다.
    - API 호출 횟수, 응답 시간, 오류 발생 등의 데이터를 수집하고 분석할 수 있습니다.
6. **API 클라이언트 생성**
    - Swagger 정의를 기반으로 다양한 언어로 API 클라이언트 코드를 생성할 수 있습니다.
    - 이를 통해 클라이언트 개발 시간을 단축하고 일관성을 유지할 수 있습니다.

⇒ Swagger를 사용하면 API 문서화 작업의 효율성과 일관성을 높일 수 있습니다. 또한 API 개발, 테스트, 모니터링 등 전체 Product 생명주기 관리에 도움이 되므로 개발 생산성 향상과 API 품질 개선을 기대할 수 있습니다.

### Database: MongoDB Atlas (cloud service)

---

[https://www.mongodb.com/ko-kr/docs/atlas/](https://www.mongodb.com/ko-kr/docs/atlas/)

1. **비정형데이터의 활용**
    
    동영상 스트리밍 서비스에서 MongoDB를 사용하는 주요 이유 중 하나는 비정형 데이터를 효과적으로 저장하고 관리할 수 있기 때문입니다. 비정형 데이터란 고정된 스키마나 구조를 갖지 않는 데이터를 말합니다. 저희는 Coursera, LearnUs와 같은 기존 플랫폼에서 같은 기존 MOOC(Massive Open Online Course) 플랫폼에서 수집한 데이터를 활용할 예정이기 때문에 각 플랫폼마다 수집한 정보가 다음과 같은 비정형 데이터를 가질 수 있습니다.
    
    **메타데이터:** 동영상 제목, 설명, 태그, 카테고리 등의 메타데이터는 획일화되고 구조화된 형태가 아닐 수 있습니다.
    
    **사용자 정보:** 사용자 프로필, 시청 기록, 평점, 댓글 등의 정보는 플 랫맏다다 른폼조구 질 가가수 있습니다.
    
    **동영상 데이터:** 동영상 자체의 메타데이터(해상도, 코덱, 비트레이트 등)도 다양한 형태를 가질 수 있습니다.
    
    **로그 데이터:** 서버 로그, 사용자 활동 로그 등의 데이터는 일반적으로 반구조화된 형태입니다.
    

- MongoDB는 문서형 구조를 채택하고 있어 새로운 데이터 형식이 추가되거나 기존 구조가 변경되더라도 유연하고 확정성있게 데이터를 다룰 수 있습니다.
- MongoDB는 복잡한 중첩 구조의 데이터를 효율적으로 저장할 수 있습니다.
- MongoDB는 로그 데이터를 JSON 형식으로 저장하여 데이터 분석 툴에 쉽게 적용할 수 있습니다.
- MongoDB는 동적 쿼리와 데이터 집계 기능을 제공하여 비정형 데이터에 대한 다양한 분석과 검색이 가능합니다. 이를 통해 사용자 행동 패턴 분석, 콘텐츠 추천 시스템 등의 기능을 구현할 수 있습니다

⇒ 다양한 MOOC 플랫폼에서 수집한 데이터는 비정형적이고 유동적인 구조를 가지고 있기 때문에, MongoDB와 같은 문서 지향 데이터베이스가 이러한 데이터를 효과적으로 저장하고 관리하는 데 적합합니다.

1. **MongoDB Atlas**
    
    **MongoDB Atlas**는 MongoDB에서 제공하는 완전 관리형 클라우드 데이터베이스 서비스입니다. 동영상 스트리밍 서비스에서 MongoDB를 사용할 때 Atlas를 활용하면 다음과 같은 이점이 있습니다.
    
    1. **간편한 프로비저닝 및 확장**
        - Atlas는 AWS, GCP, Azure 등 주요 클라우드 플랫폼에서 MongoDB 클러스터를 빠르게 프로비저닝할 수 있습니다.
        - 데이터와 트래픽 증가에 따라 스토리지와 컴퓨팅 리소스를 손쉽게 확장할 수 있습니다.
    2. **고가용성 및 내결함성**
        - Atlas는 복제셋과 샤딩 기능을 통해 고가용성과 데이터 분산을 보장합니다.
        - 클라우드 제공업체의 다중 가용 영역에 걸쳐 데이터를 분산하여 내결함성을 높입니다.
    3. **보안 및 액세스 제어**
        - Atlas는 네트워크 액세스 제어, 데이터 암호화, 감사 로깅 등 다양한 보안 기능을 제공합니다.
        - 역할 기반 액세스 제어를 통해 사용자별 권한을 세밀하게 관리할 수 있습니다.
    4. **백업 및 복구**
        - Atlas는 클라우드 스토리지에 정기적으로 스냅샷을 생성하여 데이터를 백업합니다.
        - 필요 시 특정 시점으로 데이터를 복구할 수 있는 포인트-인-타임 복구 기능을 지원합니다.
    5. **운영 자동화 및 모니터링**
        - 클러스터 프로비저닝, 패치 적용, 백업, 장애 조치 등의 작업이 자동화되어 있습니다.
        - 클라우드 기반 모니터링 대시보드를 통해 클러스터 상태를 실시간으로 추적할 수 있습니다.
    6. **글로벌 클러스터 지원**
        - Atlas는 여러 클라우드 리전에 걸친 글로벌 클러스터 배포를 지원합니다.
        - 지역별로 데이터를 분산하여 최종 사용자에게 낮은 지연시간으로 서비스를 제공할 수 있습니다.
    
    ⇒ MongoDB Atlas를 사용함으로써 스트리밍 서비스에 필요한 확장성, 가용성, 보안성, 운영 효율성 등을 클라우드 환경에서 쉽게 구현할 수 있습니다. 
    

### Remote Controller: Android SDK

---

1. **리모컨 소개**
    
    동영상 스티리밍에서 네이비게이션을 편리하게 사용하기 위해서는 기존에 있었던 LG SDK 리모컨을 사용했습니다. 이는 웹앱에 최적화 되어 있어서 선택을 하였으며 동영상 선택과 동영상 주요 기능들을 간편하게 사용할 수 있게끔 구성했습니다. 
    
2. **창의적인 옵션**
    
    수업 시간에 배운 LG 스탠바이미의 리모컨을 새롭게 제작하는 창의적인 옵션을 보여주고 싶었습니다. 이것은 프로젝트 자체에 완벽한 추가 요소가 될 것이라고 생각했습니다.
    
3. **안드로이드 SDK를 활용한 이유**
    
    우선 오픈 소스라는 장점이 있어 실물 리모컨을 제작하는 것 보다 비용을 많이 줄일 수 있습니다.. 안드로이드 SDK를 사용하면 스마트폰부터 태블릿까지 다양한 안드로이드 기기에서 실행 가능한 앱을 만들 수 있어 리모컨의 접근성과 사용성이 향상됩니다. 추가적으로 구글 서비스와 구글 어시스턴트 기능들을 활성화 시켜 쉬운 통합으로 리모컨의 기능을 향상시킬 수 있습니다. 마지막으로 서드파티 API들을 통합을 지원하여 스트리밍 콘텐츠 서비스 접근 기능을 확장할 수 있습니다.
    
4. **편리한 학습 환경 조성**
    
    리모컨(안드로이드 어플리케이션)만으로도 강의 재생, pause, 되감기 등의 기본 기능을 손쉽게 제어할 수 있기 때문에 기존 TV 시청 습관에 익숙한 사용자들도 쉽게 학습 콘텐츠에 접근할 수 있습니다.
