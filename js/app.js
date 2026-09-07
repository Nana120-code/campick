/* ============================================================
   CamPick SPA — hash router + views
   Merges the former index/home/search/community/detail/save/
   mypage pages into one document. Each view exposes
   { render(param) -> html string, init(param) } and the router
   swaps #app's content on hashchange instead of reloading pages.
   ============================================================ */

const APP = document.getElementById('app');

/* ── shared helpers ─────────────────────────────────────── */
/* 아이콘은 js/icons.js에 담아 둔 SVG를 data URI로 만들어 쓴다.
   원격 URL을 mask로 쓰면 file:// 로 열었을 때 브라우저가 막아
   아이콘이 전부 사라진다. 목록에 없는 이름만 CDN으로 넘긴다. */
function iconMask(name){
  const svg = (typeof ICON_SVG !== 'undefined') ? ICON_SVG[name] : null;
  const url = svg
    ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    : `https://api.iconify.design/${name}.svg`;
  return `-webkit-mask-image:url('${url}');mask-image:url('${url}');`;
}

/* ── 다국어(i18n) ────────────────────────────────────────── */
const LANGS = [
  { code:'ko', native:'한국어' },
  { code:'en', native:'English' },
  { code:'zh', native:'中文' },
  { code:'ja', native:'日本語' },
];

const I18N = {
  ko: {
    nav:{ home:'홈', search:'탐색', community:'커뮤니티', save:'저장', mypage:'마이페이지' },
    common:{ deadlineLabel:(d)=>`${d} 마감` },
    title:{ onboarding:'온보딩', detail:'상세보기' },
    ob:{
      heroLine1:'캠퍼스 라이프', heroLine2Pre:'필요한 정보만 ', heroLine2Accent:'PICK!',
      sub1:'당신의 캠퍼스 라이프를', sub2:'더 편리하고 즐겁게', sub3:'CamPick이 함께합니다.',
      start:'시작하기', prevAria:'이전으로',
      verifyTitleLine1:'우리 학교를', verifyTitleLine2:'인증해 주세요',
      verifyDescLine1:'학교 인증 후 더 정확한 정보를', verifyDescLine2:'추천받을 수 있어요.',
      emailPlaceholder:'학교 이메일을 입력해주세요.', emailPlaceholderSub:'(ex. Osan123@university.ac.kr)',
      emailHint:'학교 이메일 아닌가요?', verifyBtn:'인증하기',
      interestTitle:'관심사를 선택해 주세요', interestDescPre:'선택한 관심사에 맞는 정보를 추천해 드릴게요 ', interestDescAccent:'(최소 3개 선택)',
      counterNeedSuffix:'/3개 이상 선택해주세요', counterDoneSuffix:'개 선택완료! 더 선택할 수 있어요',
      finishBtn:'선택 완료', finishDone:'완료! 🎉',
    },
    tags:{ design:'디자인', contest:'공모전', it:'IT / 개발', study:'스터디', travel:'여행', jeju:'제주', lightning:'번개', event:'행사', hackathon:'해커톤', activity:'대외활동', culture:'문화/예술', project:'프로젝트', media:'영상 / 미디어', marketing:'마케팅', travelcamp:'여행 / 캠핑', photo:'사진', music:'음악', startup:'창업', humanities:'인문 / 사회', free:'자유' },
    home:{ searchPlaceholder:'검색어를 입력하세요', todayPick:'오늘의 PICK', recommend:'관심사 기반 추천', more:'더보기', notifAria:'알림', langAria:'언어 선택' },
    lang:{ sheetTitle:'언어 선택' },
    search:{ title:'탐색', searchPlaceholder:'검색어를 입력하세요', sortDeadline:'마감임박순', filterAll:'전체' },
    community:{
      title:'커뮤니티', backAria:'뒤로가기',
      myCommunities:'내 커뮤니티', myEmpty:'아직 가입한 커뮤니티가 없어요.',
      bannerEyebrow:'추천 커뮤니티', communitySuffix:' 커뮤니티', browseTitle:'커뮤니티 둘러보기',
      members:(n)=>`멤버 ${n}명`, peopleUnit:'명', posts:(n)=>`글 ${n}개`,
      join:'가입하기', joined:'가입됨', leaveConfirm:'이 커뮤니티에서 나갈까요?',
      schoolBadge:'우리 학교', interestBadge:'관심사',
      tabPopular:'인기', tabLatest:'최신', tabRecruit:'모집',
      emptyFeed:'아직 글이 없어요. 첫 글을 남겨보세요!', emptyRecruit:'진행 중인 모집이 없어요.',
      notFound:'존재하지 않는 커뮤니티입니다.',
      timeNow:'방금 전', timeHour:(n)=>`${n}시간 전`, timeDay:(n)=>`${n}일 전`,
      liveRecruit:'실시간 모집글', writeBtn:'글 작성하기',
    },
    write:{
      title:'글쓰기', category:'카테고리', postingTo:'게시할 커뮤니티', titlePlaceholder:'제목을 입력해주세요', contentPlaceholder:'자유롭게 이야기를 나눠보세요',
      photoLabel:'사진 첨부', addPhoto:'추가', removePhotoAria:'사진 삭제', backAria:'뒤로가기',
      submit:'등록하기', submitting:'등록 중...', success:'게시글이 등록되었습니다',
      leaveConfirm:'작성 중인 내용이 사라집니다. 나가시겠습니까?',
      saveFailed:'저장 공간이 부족해 글을 등록하지 못했습니다.',
    },
    post:{ mine:'내가 쓴 글', deleteBtn:'삭제하기', deleteConfirm:'이 게시글을 삭제할까요?', notFound:'삭제되었거나 없는 글입니다.' },
    detail:{ introTitle:'상세 소개', periodTitle:'접수 기간', applyBtn:'접수하러 가기', saveAria:'저장', backAria:'뒤로가기', applyAlert:'접수 페이지로 연결됩니다. (연동 예정)' },
    info:{ host:'주최', target:'참가대상', method:'접수방법', prize:'시상내역' },
    save:{ title:'저장', edit:'편집', done:'완료', total:'전체', sortLatest:'최신순', unsaveAria:'저장 취소' },
    mypage:{ title:'마이페이지', verifiedBadge:'학교 인증 완료', statSaved:'저장한 콘텐츠', statPosts:'작성한 글', statActivities:'참여한 활동', interestManage:'관심사 관리', editLink:'수정하기', schoolVerify:'학교 인증', verifiedShort:'인증 완료', settingsLabel:'설정' },
    menu:{ notif:'알림 설정', support:'고객센터', notice:'공지사항', privacy:'개인정보 처리방침', terms:'이용약관', logout:'로그아웃' },
  },
  en: {
    nav:{ home:'Home', search:'Explore', community:'Community', save:'Saved', mypage:'My Page' },
    common:{ deadlineLabel:(d)=>`Deadline ${d}` },
    title:{ onboarding:'Onboarding', detail:'Details' },
    ob:{
      heroLine1:'Campus Life', heroLine2Pre:'Only what you need, ', heroLine2Accent:'PICK!',
      sub1:'Make your campus life', sub2:'more convenient and fun', sub3:'with CamPick.',
      start:'Get Started', prevAria:'Back',
      verifyTitleLine1:'Verify your', verifyTitleLine2:'school email',
      verifyDescLine1:'Verify your school email for', verifyDescLine2:'more accurate recommendations.',
      emailPlaceholder:'Enter your school email', emailPlaceholderSub:'(e.g. Osan123@university.ac.kr)',
      emailHint:'Not your school email?', verifyBtn:'Verify',
      interestTitle:'Select your interests', interestDescPre:'We’ll recommend content based on your interests ', interestDescAccent:'(select at least 3)',
      counterNeedSuffix:'/3 — select at least 3', counterDoneSuffix:' selected! Pick more if you like',
      finishBtn:'Done', finishDone:'All set! \u{1F389}',
    },
    tags:{ design:'Design', contest:'Contest', it:'IT / Dev', study:'Study', travel:'Travel', jeju:'Jeju', lightning:'Meetup', event:'Event', hackathon:'Hackathon', activity:'Activity', culture:'Culture/Art', project:'Project', media:'Video/Media', marketing:'Marketing', travelcamp:'Travel/Camping', photo:'Photography', music:'Music', startup:'Startup', humanities:'Humanities/Society', free:'Free' },
    home:{ searchPlaceholder:'Search', todayPick:'Today’s Pick', recommend:'Recommended for You', more:'More', notifAria:'Notifications', langAria:'Select language' },
    lang:{ sheetTitle:'Select Language' },
    search:{ title:'Explore', searchPlaceholder:'Search', sortDeadline:'Deadline soon', filterAll:'All' },
    community:{
      title:'Community', backAria:'Back',
      myCommunities:'My Communities', myEmpty:"You haven't joined any community yet.",
      bannerEyebrow:'Recommended Community', communitySuffix:' Community', browseTitle:'Browse Communities',
      members:(n)=>`${n} members`, peopleUnit:'', posts:(n)=>`${n} posts`,
      join:'Join', joined:'Joined', leaveConfirm:'Leave this community?',
      schoolBadge:'My School', interestBadge:'Interest',
      tabPopular:'Popular', tabLatest:'Latest', tabRecruit:'Recruiting',
      emptyFeed:'No posts yet. Be the first to write one!', emptyRecruit:'No open recruitments.',
      notFound:'This community does not exist.',
      timeNow:'just now', timeHour:(n)=>`${n}h ago`, timeDay:(n)=>`${n}d ago`,
      liveRecruit:'Live Recruiting', writeBtn:'Write a Post',
    },
    write:{
      title:'New Post', category:'Category', postingTo:'Posting to', titlePlaceholder:'Enter a title', contentPlaceholder:'Share your thoughts',
      photoLabel:'Photos', addPhoto:'Add', removePhotoAria:'Remove photo', backAria:'Back',
      submit:'Post', submitting:'Posting...', success:'Your post has been published',
      leaveConfirm:'Your draft will be lost. Leave anyway?',
      saveFailed:'Not enough storage space to save this post.',
    },
    post:{ mine:'My post', deleteBtn:'Delete', deleteConfirm:'Delete this post?', notFound:'This post was deleted or does not exist.' },
    detail:{ introTitle:'Details', periodTitle:'Application Period', applyBtn:'Apply Now', saveAria:'Save', backAria:'Back', applyAlert:'You’ll be redirected to the application page. (Coming soon)' },
    info:{ host:'Host', target:'Eligibility', method:'How to Apply', prize:'Prize' },
    save:{ title:'Saved', edit:'Edit', done:'Done', total:'Total', sortLatest:'Newest', unsaveAria:'Unsave' },
    mypage:{ title:'My Page', verifiedBadge:'School Verified', statSaved:'Saved', statPosts:'Posts', statActivities:'Activities', interestManage:'Manage Interests', editLink:'Edit', schoolVerify:'School Verification', verifiedShort:'Verified', settingsLabel:'Settings' },
    menu:{ notif:'Notifications', support:'Support', notice:'Notices', privacy:'Privacy Policy', terms:'Terms of Service', logout:'Log Out' },
  },
  zh: {
    nav:{ home:'首页', search:'探索', community:'社区', save:'收藏', mypage:'我的' },
    common:{ deadlineLabel:(d)=>`截止 ${d}` },
    title:{ onboarding:'新手引导', detail:'详情' },
    ob:{
      heroLine1:'校园生活', heroLine2Pre:'只为你精选 ', heroLine2Accent:'PICK!',
      sub1:'让你的校园生活', sub2:'更便捷更精彩', sub3:'CamPick 与你同行',
      start:'开始使用', prevAria:'返回',
      verifyTitleLine1:'请验证', verifyTitleLine2:'您的学校邮箱',
      verifyDescLine1:'验证学校邮箱后', verifyDescLine2:'可获得更精准的推荐',
      emailPlaceholder:'请输入学校邮箱', emailPlaceholderSub:'(例：Osan123@university.ac.kr)',
      emailHint:'不是学校邮箱？', verifyBtn:'验证',
      interestTitle:'请选择您的兴趣', interestDescPre:'根据您选择的兴趣为您推荐内容 ', interestDescAccent:'(至少选择3个)',
      counterNeedSuffix:'/3，请至少选择3个', counterDoneSuffix:'个已选！还可以继续选择',
      finishBtn:'完成选择', finishDone:'完成！🎉',
    },
    tags:{ design:'设计', contest:'竞赛', it:'IT / 开发', study:'学习小组', travel:'旅行', jeju:'济州岛', lightning:'快闪聚会', event:'活动', hackathon:'黑客马拉松', activity:'校外活动', culture:'文化/艺术', project:'项目', media:'影像/媒体', marketing:'市场营销', travelcamp:'旅行/露营', photo:'摄影', music:'音乐', startup:'创业', humanities:'人文/社会', free:'自由' },
    home:{ searchPlaceholder:'请输入搜索词', todayPick:'今日推荐', recommend:'为您推荐', more:'更多', notifAria:'通知', langAria:'选择语言' },
    lang:{ sheetTitle:'选择语言' },
    search:{ title:'探索', searchPlaceholder:'请输入搜索词', sortDeadline:'截止日期最近', filterAll:'全部' },
    community:{
      title:'社区', backAria:'返回',
      myCommunities:'我的社区', myEmpty:'你还没有加入任何社区。',
      bannerEyebrow:'推荐社区', communitySuffix:'社区', browseTitle:'浏览社区',
      members:(n)=>`${n}位成员`, peopleUnit:'人', posts:(n)=>`${n}篇帖子`,
      join:'加入', joined:'已加入', leaveConfirm:'要退出这个社区吗？',
      schoolBadge:'我的学校', interestBadge:'兴趣',
      tabPopular:'热门', tabLatest:'最新', tabRecruit:'招募',
      emptyFeed:'还没有帖子，来发第一篇吧！', emptyRecruit:'暂无进行中的招募。',
      notFound:'该社区不存在。',
      timeNow:'刚刚', timeHour:(n)=>`${n}小时前`, timeDay:(n)=>`${n}天前`,
      liveRecruit:'实时招募', writeBtn:'发布帖子',
    },
    write:{
      title:'写帖子', category:'分类', postingTo:'发布到', titlePlaceholder:'请输入标题', contentPlaceholder:'请自由分享你的想法',
      photoLabel:'添加照片', addPhoto:'添加', removePhotoAria:'删除照片', backAria:'返回',
      submit:'发布', submitting:'发布中...', success:'帖子已发布',
      leaveConfirm:'正在编写的内容将会消失，确定要离开吗？',
      saveFailed:'存储空间不足，无法保存该帖子。',
    },
    post:{ mine:'我发布的', deleteBtn:'删除', deleteConfirm:'要删除这篇帖子吗？', notFound:'该帖子已被删除或不存在。' },
    detail:{ introTitle:'详细介绍', periodTitle:'报名期间', applyBtn:'前往报名', saveAria:'收藏', backAria:'返回', applyAlert:'即将跳转至报名页面（即将开放）' },
    info:{ host:'主办方', target:'参与对象', method:'报名方式', prize:'奖励详情' },
    save:{ title:'收藏', edit:'编辑', done:'完成', total:'全部', sortLatest:'最新', unsaveAria:'取消收藏' },
    mypage:{ title:'我的', verifiedBadge:'学校认证完成', statSaved:'收藏内容', statPosts:'发布帖子', statActivities:'参与活动', interestManage:'兴趣管理', editLink:'编辑', schoolVerify:'学校认证', verifiedShort:'认证完成', settingsLabel:'设置' },
    menu:{ notif:'通知设置', support:'客户支持', notice:'公告', privacy:'隐私政策', terms:'服务条款', logout:'退出登录' },
  },
  ja: {
    nav:{ home:'ホーム', search:'探す', community:'コミュニティ', save:'保存', mypage:'マイページ' },
    common:{ deadlineLabel:(d)=>`${d} 締切` },
    title:{ onboarding:'オンボーディング', detail:'詳細' },
    ob:{
      heroLine1:'キャンパスライフ', heroLine2Pre:'必要な情報だけ ', heroLine2Accent:'PICK!',
      sub1:'あなたのキャンパスライフを', sub2:'もっと便利に、もっと楽しく', sub3:'CamPickがサポートします。',
      start:'はじめる', prevAria:'戻る',
      verifyTitleLine1:'学校を', verifyTitleLine2:'認証してください',
      verifyDescLine1:'学校認証をすると、より正確な情報を', verifyDescLine2:'おすすめできます。',
      emailPlaceholder:'学校のメールアドレスを入力してください。', emailPlaceholderSub:'(例：Osan123@university.ac.kr)',
      emailHint:'学校のメールではありませんか？', verifyBtn:'認証する',
      interestTitle:'興味のある分野を選んでください', interestDescPre:'選んだ興味に合わせて情報をおすすめします ', interestDescAccent:'(最低3つ選択)',
      counterNeedSuffix:'/3個以上選択してください', counterDoneSuffix:'個選択完了！もっと選べます',
      finishBtn:'選択完了', finishDone:'完了！🎉',
    },
    tags:{ design:'デザイン', contest:'コンテスト', it:'IT / 開発', study:'スタディ', travel:'旅行', jeju:'済州島', lightning:'突発集合', event:'イベント', hackathon:'ハッカソン', activity:'課外活動', culture:'文化/芸術', project:'プロジェクト', media:'映像/メディア', marketing:'マーケティング', travelcamp:'旅行/キャンプ', photo:'写真', music:'音楽', startup:'起業', humanities:'人文/社会', free:'自由' },
    home:{ searchPlaceholder:'検索ワードを入力してください', todayPick:'今日のPICK', recommend:'興味ベースのおすすめ', more:'もっと見る', notifAria:'通知', langAria:'言語選択' },
    lang:{ sheetTitle:'言語を選択' },
    search:{ title:'探す', searchPlaceholder:'検索ワードを入力してください', sortDeadline:'締切間近順', filterAll:'すべて' },
    community:{
      title:'コミュニティ', backAria:'戻る',
      myCommunities:'マイコミュニティ', myEmpty:'まだ参加しているコミュニティがありません。',
      bannerEyebrow:'おすすめコミュニティ', communitySuffix:'コミュニティ', browseTitle:'コミュニティを探す',
      members:(n)=>`メンバー${n}人`, peopleUnit:'人', posts:(n)=>`投稿${n}件`,
      join:'参加する', joined:'参加中', leaveConfirm:'このコミュニティから抜けますか？',
      schoolBadge:'わが校', interestBadge:'興味',
      tabPopular:'人気', tabLatest:'最新', tabRecruit:'募集',
      emptyFeed:'まだ投稿がありません。最初の投稿をしてみましょう！', emptyRecruit:'進行中の募集はありません。',
      notFound:'存在しないコミュニティです。',
      timeNow:'たった今', timeHour:(n)=>`${n}時間前`, timeDay:(n)=>`${n}日前`,
      liveRecruit:'リアルタイム募集', writeBtn:'投稿する',
    },
    write:{
      title:'投稿作成', category:'カテゴリー', postingTo:'投稿先', titlePlaceholder:'タイトルを入力してください', contentPlaceholder:'自由に内容を書いてください',
      photoLabel:'写真添付', addPhoto:'追加', removePhotoAria:'写真を削除', backAria:'戻る',
      submit:'投稿する', submitting:'投稿中...', success:'投稿が完了しました',
      leaveConfirm:'作成中の内容が消えます。移動しますか？',
      saveFailed:'保存容量が足りず、投稿を保存できませんでした。',
    },
    post:{ mine:'自分の投稿', deleteBtn:'削除する', deleteConfirm:'この投稿を削除しますか？', notFound:'削除されたか存在しない投稿です。' },
    detail:{ introTitle:'詳細紹介', periodTitle:'応募期間', applyBtn:'応募しに行く', saveAria:'保存', backAria:'戻る', applyAlert:'応募ページへ移動します。(連携予定)' },
    info:{ host:'主催', target:'参加対象', method:'応募方法', prize:'賞品内容' },
    save:{ title:'保存', edit:'編集', done:'完了', total:'全体', sortLatest:'最新順', unsaveAria:'保存解除' },
    mypage:{ title:'マイページ', verifiedBadge:'学校認証完了', statSaved:'保存したコンテンツ', statPosts:'作成した投稿', statActivities:'参加した活動', interestManage:'興味の管理', editLink:'編集する', schoolVerify:'学校認証', verifiedShort:'認証完了', settingsLabel:'設定' },
    menu:{ notif:'通知設定', support:'カスタマーセンター', notice:'お知らせ', privacy:'プライバシーポリシー', terms:'利用規約', logout:'ログアウト' },
  },
};

let currentLang = localStorage.getItem('campick.lang') || 'ko';
if(!I18N[currentLang]) currentLang = 'ko';

function t(key, ...args){
  const parts = key.split('.');
  let node = I18N[currentLang];
  for(const p of parts){ node = node && node[p]; }
  if(node === undefined){
    node = I18N.ko;
    for(const p of parts){ node = node && node[p]; }
  }
  if(typeof node === 'function') return node(...args);
  return node !== undefined ? node : key;
}

const TAG_I18N_KEY = {
  '디자인':'design', '공모전':'contest', 'IT / 개발':'it', 'IT/개발':'it', 'IT':'it',
  '스터디':'study', '여행':'travel', '제주':'jeju', '번개':'lightning', '행사':'event',
  '해커톤':'hackathon', '대외활동':'activity', '문화/예술':'culture', '프로젝트':'project',
  '영상 / 미디어':'media', '마케팅':'marketing', '여행 / 캠핑':'travelcamp', '사진':'photo',
  '음악':'music', '창업':'startup', '인문 / 사회':'humanities', '자유':'free',
};
function translateTag(label){
  const key = TAG_I18N_KEY[label];
  return key ? t('tags.'+key) : label;
}

/* multilingual content field, e.g. {ko:'...', en:'...', zh:'...', ja:'...'} */
function ct(field){
  if(field == null) return '';
  if(typeof field === 'string') return field;
  return field[currentLang] || field.ko || '';
}

const TAG_COLORS = {
  '디자인':      {bg:'#f2ecff', fg:'#7c3aed'},
  '공모전':      {bg:'#eef0ff', fg:'#4338ca'},
  'IT / 개발':   {bg:'#e6f4ff', fg:'#2563eb'},
  'IT/개발':     {bg:'#e6f4ff', fg:'#2563eb'},
  'IT':          {bg:'#e6f4ff', fg:'#2563eb'},
  '스터디':      {bg:'#e8fbf0', fg:'#059669'},
  '여행':        {bg:'#e6fbfb', fg:'#0891b2'},
  '제주':        {bg:'#e6fbfb', fg:'#0891b2'},
  '번개':        {bg:'#fff1e6', fg:'#ea580c'},
  '행사':        {bg:'#fff1e6', fg:'#ea580c'},
  '해커톤':      {bg:'#eefcf3', fg:'#16a34a'},
  '대외활동':    {bg:'#fef2f2', fg:'#dc2626'},
  '문화/예술':   {bg:'#fdf4e3', fg:'#b45309'},
  '프로젝트':    {bg:'#f2ecff', fg:'#7c3aed'},
  '영상 / 미디어': {bg:'#fdeef5', fg:'#db2777'},
  '마케팅':      {bg:'#fff4e0', fg:'#d97706'},
  '여행 / 캠핑': {bg:'#e6fbfb', fg:'#0891b2'},
  '사진':        {bg:'#eef2ff', fg:'#4f46e5'},
  '음악':        {bg:'#faf0ff', fg:'#a21caf'},
  '창업':        {bg:'#fef9e7', fg:'#a16207'},
  '인문 / 사회': {bg:'#f0fdfa', fg:'#0d9488'},
  '자유':        {bg:'rgba(89,94,144,0.08)', fg:'#595e90'},
};
const DEFAULT_TAG = {bg:'#f1f2fa', fg:'#595e90'};
function tagChip(label){
  const c = TAG_COLORS[label] || DEFAULT_TAG;
  return `<span class="tag" style="background:${c.bg};color:${c.fg};">${translateTag(label)}</span>`;
}

/* 작성한 글 저장/삭제/사진 축소는 js/posts.js (단독 페이지와 공유) */
const DATE_LOCALE = { ko:'ko-KR', en:'en-US', zh:'zh-CN', ja:'ja-JP' };
function postDate(ts){ return formatPostDate(ts, DATE_LOCALE[currentLang] || 'ko-KR'); }

function renderBottomNav(active){
  const items = [
    { key:'home',      icon:'iconoir:home' },
    { key:'search',    icon:'iconoir:search' },
    { key:'community', icon:'iconoir:community' },
    { key:'save',      icon:'iconoir:bookmark' },
    { key:'mypage',    icon:'iconoir:profile-circle' },
  ];
  return `
    <nav class="bottom-nav">
      <div class="app-wrap" style="width:100%;">
        <div style="display:flex;">
          ${items.map(it => `
            <a class="nav-item ${it.key === active ? 'active' : ''}" href="#/${it.key}">
              <span class="icon" style="${iconMask(it.icon)}"></span>
              <span>${t('nav.'+it.key)}</span>
            </a>
          `).join('')}
        </div>
      </div>
    </nav>`;
}

/* ── 콘텐츠 저장소 ──────────────────────────────────────────
   공모전·대외활동·스터디 등 앱이 보여 주는 활동 정보를 여기 한 곳에 모은다.
   홈 추천 / 탐색 / 저장 / 상세가 모두 이 배열을 id로 참조한다. */
function findContent(id){ return CONTENTS.find(c => c.id === id) || null; }
function pickContents(ids){ return ids.map(findContent).filter(Boolean); }

const CONTENTS = [
  // 디자인
  { id:'ux-contest', tags:['디자인','공모전'], title:{ko:'2026 UI/UX 디자인 공모전', en:'2026 UI/UX Design Contest', zh:'2026 UI/UX设计大赛', ja:'2026 UI/UXデザインコンテスト'}, deadline:'~05.20', urgent:false, icon:'iconoir:trophy', img:'https://images.unsplash.com/photo-1502810190503-8303352d0dd1?w=200&h=200&fit=crop&q=80' },
  { id:'brand-exhibit', tags:['디자인','문화/예술'], title:{ko:'브랜드 아이덴티티 디자인 전시회', en:'Brand Identity Design Exhibition', zh:'品牌形象设计展', ja:'ブランドアイデンティティデザイン展'}, deadline:'~05.28', urgent:false, icon:'iconoir:design-pencil', img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop&q=80' },
  { id:'typo-study', tags:['디자인','스터디'], title:{ko:'타이포그래피 디자인 스터디 모집', en:'Typography Design Study Group', zh:'招募字体设计学习小组成员', ja:'タイポグラフィデザインスタディ募集'}, deadline:'~04.25', urgent:true, icon:'iconoir:group', img:'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=200&h=200&fit=crop&q=80' },
  // IT / 개발
  { id:'data-study', tags:['IT / 개발','스터디'], title:{ko:'데이터 분석 스터디 모집', en:'Data Analysis Study Group', zh:'招募数据分析学习小组成员', ja:'データ分析スタディ募集'}, deadline:'~04.30', urgent:true, icon:'iconoir:group', desc:{ko:'함께 성장할 데이터 분석 스터디 팀원을 찾습니다!', en:'Looking for members to grow together in data analysis!', zh:'寻找一起成长的数据分析学习小组成员！', ja:'共に成長するデータ分析スタディメンバーを探しています！'}, eye:'856', comment:'86', img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&q=80' },
  { id:'esg-hack', tags:['IT / 개발','해커톤'], title:{ko:'ESG 아이디어 해커톤', en:'ESG Idea Hackathon', zh:'ESG创意黑客马拉松', ja:'ESGアイデアハッカソン'}, deadline:'~06.07', urgent:false, icon:'iconoir:code', desc:{ko:'지속 가능한 미래를 위한 아이디어를 제안해 주세요.', en:'Propose ideas for a sustainable future.', zh:'请为可持续发展的未来提出创意。', ja:'持続可能な未来のためのアイデアをご提案ください。'}, eye:'1.5K', comment:'152', img:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&q=80' },
  { id:'campus-app', tags:['IT / 개발','프로젝트'], title:{ko:'캠퍼스 앱 개발 프로젝트 팀원 모집', en:'Campus App Dev Project Team', zh:'招募校园App开发项目成员', ja:'キャンパスアプリ開発プロジェクトメンバー募集'}, deadline:'~05.12', urgent:false, icon:'iconoir:code', img:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop&q=80' },
  // 영상 / 미디어
  { id:'short-film', tags:['영상 / 미디어','공모전'], title:{ko:'대학생 단편 영상 공모전', en:'College Short Film Contest', zh:'大学生短片竞赛', ja:'大学生短編映像コンテスト'}, deadline:'~05.31', urgent:false, icon:'iconoir:play', img:'https://images.unsplash.com/photo-1552581234-26160f608093?w=200&h=200&fit=crop&q=80' },
  { id:'vlog-study', tags:['영상 / 미디어','스터디'], title:{ko:'브이로그 크리에이터 스터디 모집', en:'Vlog Creator Study Group', zh:'招募Vlog创作者学习小组成员', ja:'Vlogクリエイタースタディ募集'}, deadline:'~04.28', urgent:true, icon:'iconoir:play', img:'https://images.unsplash.com/photo-1595872018818-97555653a011?w=200&h=200&fit=crop&q=80' },
  { id:'media-art', tags:['영상 / 미디어','행사'], title:{ko:'미디어아트 전시 & 상영회', en:'Media Art Exhibition & Screening', zh:'媒体艺术展览暨放映会', ja:'メディアアート展示&上映会'}, deadline:'~05.16', urgent:false, icon:'iconoir:play', img:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=200&fit=crop&q=80' },
  // 마케팅
  { id:'mkt-supporters', tags:['마케팅','대외활동'], title:{ko:'대학생 마케팅 서포터즈 15기 모집', en:'15th College Marketing Supporters', zh:'第15期大学生市场营销支持者招募', ja:'大学生マーケティングサポーターズ15期募集'}, deadline:'~05.09', urgent:false, icon:'iconoir:megaphone', img:'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=200&h=200&fit=crop&q=80' },
  { id:'sns-contest', tags:['마케팅','공모전'], title:{ko:'SNS 콘텐츠 마케팅 공모전', en:'SNS Content Marketing Contest', zh:'SNS内容营销大赛', ja:'SNSコンテンツマーケティングコンテスト'}, deadline:'~05.23', urgent:false, icon:'iconoir:megaphone', img:'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=200&h=200&fit=crop&q=80' },
  { id:'brand-study', tags:['마케팅','스터디'], title:{ko:'브랜드 마케팅 전략 스터디', en:'Brand Marketing Strategy Study', zh:'品牌营销战略学习小组', ja:'ブランドマーケティング戦略スタディ'}, deadline:'~04.22', urgent:true, icon:'iconoir:group', img:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&q=80' },
  // 여행 / 캠핑
  { id:'jeju-trip', tags:['여행 / 캠핑','번개'], title:{ko:'제주도 2박 3일 번개 여행', en:'3-Day Jeju Island Meetup Trip', zh:'济州岛3天2夜快闪旅行', ja:'済州島2泊3日突発旅行'}, deadline:'~05.10', urgent:false, icon:'iconoir:map', img:'https://images.unsplash.com/photo-1628411848698-e3b3249a272a?w=200&h=200&fit=crop&q=80' },
  { id:'autumn-camp', tags:['여행 / 캠핑','번개'], title:{ko:'가을맞이 대학생 캠핑 모임', en:'Autumn Camping Meetup for Students', zh:'迎秋大学生露营聚会', ja:'秋の大学生キャンプ集会'}, deadline:'~05.18', urgent:false, icon:'iconoir:map', img:'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&h=200&fit=crop&q=80' },
  { id:'backpack-club', tags:['여행 / 캠핑','대외활동'], title:{ko:'국내 배낭여행 동아리원 모집', en:'Domestic Backpacking Club Members Wanted', zh:'招募国内背包旅行社团成员', ja:'国内バックパック旅行サークル員募集'}, deadline:'~04.27', urgent:true, icon:'iconoir:group', img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&h=200&fit=crop&q=80' },
  // 사진
  { id:'campus-photo', tags:['사진','공모전'], title:{ko:'캠퍼스 사진 공모전 - 나의 대학생활', en:'Campus Photo Contest — My College Life', zh:'校园摄影大赛——我的大学生活', ja:'キャンパス写真コンテスト —私の大学生活'}, deadline:'~05.25', urgent:false, icon:'iconoir:camera', img:'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200&fit=crop&q=80' },
  { id:'film-club', tags:['사진','스터디'], title:{ko:'필름 사진 동호회 신입 모집', en:'Film Photography Club New Members', zh:'招募胶片摄影社新成员', ja:'フィルム写真同好会新入部員募集'}, deadline:'~04.29', urgent:true, icon:'iconoir:group', img:'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop&q=80' },
  { id:'photo-walk', tags:['사진','번개'], title:{ko:'사진작가와 함께하는 출사 모임', en:'Photo Walk with a Pro Photographer', zh:'与摄影师一起的外拍活动', ja:'写真家と行く撮影会'}, deadline:'~05.14', urgent:false, icon:'iconoir:camera', img:'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=200&h=200&fit=crop&q=80' },
  // 음악
  { id:'song-festival', tags:['음악','공모전'], title:{ko:'대학가요제 참가팀 모집', en:'College Song Festival Team Recruitment', zh:'大学歌谣祭参赛队伍招募', ja:'大学歌謡祭参加チーム募集'}, deadline:'~05.30', urgent:false, icon:'iconoir:music-note', img:'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop&q=80' },
  { id:'band-session', tags:['음악','대외활동'], title:{ko:'밴드 동아리 세션 멤버 모집', en:'Band Club Session Member Recruitment', zh:'乐队社团招募伴奏成员', ja:'バンドサークルセッションメンバー募集'}, deadline:'~04.24', urgent:true, icon:'iconoir:group', img:'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=200&fit=crop&q=80' },
  { id:'busking-volunteer', tags:['음악','행사'], title:{ko:'버스킹 페스티벌 자원봉사자 모집', en:'Busking Festival Volunteer Recruitment', zh:'街头表演节志愿者招募', ja:'ストリートライブフェスティバルボランティア募集'}, deadline:'~05.17', urgent:false, icon:'iconoir:music-note', img:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=200&fit=crop&q=80' },
  // 창업
  { id:'startup-idea', tags:['창업','공모전'], title:{ko:'전국 대학생 창업 아이디어 공모전', en:'National College Startup Idea Contest', zh:'全国大学生创业创意大赛', ja:'全国大学生起業アイデアコンテスト'}, deadline:'~06.05', urgent:false, icon:'iconoir:light-bulb', img:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&q=80' },
  { id:'startup-intern', tags:['창업','대외활동'], title:{ko:'스타트업 인턴십 프로그램 모집', en:'Startup Internship Program', zh:'创业公司实习项目招募', ja:'スタートアップインターンシッププログラム募集'}, deadline:'~05.02', urgent:true, icon:'iconoir:light-bulb', img:'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&h=200&fit=crop&q=80' },
  { id:'prestartup-team', tags:['창업','프로젝트'], title:{ko:'예비창업패키지 도전 팀원 모집', en:'Pre-Startup Package Challenge Team', zh:'招募预备创业扶持项目挑战团队成员', ja:'予備創業パッケージ挑戦チームメンバー募集'}, deadline:'~05.21', urgent:false, icon:'iconoir:light-bulb', img:'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop&q=80' },
  // 인문 / 사회
  { id:'classics-reading', tags:['인문 / 사회','스터디'], title:{ko:'인문학 고전 독서 토론 모임', en:'Humanities Classics Reading Group', zh:'人文经典读书讨论会', ja:'人文学古典読書討論会'}, deadline:'~04.26', urgent:true, icon:'iconoir:book', img:'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=200&h=200&fit=crop&q=80' },
  { id:'social-innovation', tags:['인문 / 사회','공모전'], title:{ko:'사회혁신 아이디어 공모전', en:'Social Innovation Idea Contest', zh:'社会创新创意大赛', ja:'社会革新アイデアコンテスト'}, deadline:'~05.29', urgent:false, icon:'iconoir:book', img:'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=200&h=200&fit=crop&q=80' },
  { id:'edu-volunteer', tags:['인문 / 사회','대외활동'], title:{ko:'교육 봉사활동 서포터즈 모집', en:'Education Volunteer Supporters', zh:'教育志愿服务支持者招募', ja:'教育ボランティア活動サポーターズ募集'}, deadline:'~05.06', urgent:false, icon:'iconoir:group', img:'https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=200&h=200&fit=crop&q=80' },
  // 탐색·저장 화면에 따로 적혀 있던 항목을 여기로 옮겼다
  { id:'korea-design', tags:['디자인','공모전'], title:{ko:'2026 대한민국 디자인 공모전', en:'2026 Korea Design Contest', zh:'2026韩国设计大赛', ja:'2026韓国デザインコンテスト'}, desc:{ko:'창의적인 아이디어로 세상을 디자인하세요!', en:'Design the world with your creative ideas!', zh:'用创意设计世界吧！', ja:'創造的なアイデアで世界をデザインしよう！'}, deadline:'~05.20', urgent:false, icon:'iconoir:trophy', eye:'1.2K', comment:'124', img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop&q=80' },
];

/* ════════════════════════════════════════════════════════════
   화면: 온보딩
   ════════════════════════════════════════════════════════════ */
const ViewOnboarding = {
  render(){
    return `
      <div class="app-shell">
        <div class="track" id="track">

          <section class="screen" data-screen="0" aria-label="온보딩 1 - 소개">
            <section class="logo-section">
              <div class="logo-mark"><img src="캠픽-로고 1.png" alt="CamPick 로고" /></div>
              <p class="logo-text">CamPick</p>
            </section>
            <section class="s1-title">
              <p>${t('ob.heroLine1')}</p>
              <p>${t('ob.heroLine2Pre')}<span class="accent">${t('ob.heroLine2Accent')}</span></p>
            </section>
            <section class="s1-sub">
              <p>${t('ob.sub1')}</p>
              <p>${t('ob.sub2')}</p>
              <p>${t('ob.sub3')}</p>
            </section>
            <div class="hero-image"><img src="image1.png" alt="캠퍼스 라이프를 즐기는 학생들 일러스트" /></div>
            <section class="cta-section">
              <button class="cta-button" type="button" id="ob-start">${t('ob.start')}</button>
            </section>
          </section>

          <section class="screen" data-screen="1" aria-label="온보딩 2 - 학교 인증">
            <button class="back-btn" type="button" id="ob-back-1" aria-label="${t('ob.prevAria')}">
              <span class="icon" style="${iconMask('mdi:chevron-left')};width:28px;height:28px;"></span>
            </button>
            <div class="s2-body">
              <h1>${t('ob.verifyTitleLine1')}<br>${t('ob.verifyTitleLine2')}</h1>
              <p>${t('ob.verifyDescLine1')}<br>${t('ob.verifyDescLine2')}</p>
            </div>
            <div class="school-input" id="schoolInputBox">
              <span class="icon" style="${iconMask('material-symbols:mail-outline')}"></span>
              <div style="width:100%;">
                <input id="schoolEmail" type="email" placeholder="${t('ob.emailPlaceholder')}" />
                <span class="placeholder-sub">${t('ob.emailPlaceholderSub')}</span>
              </div>
            </div>
            <button type="button" class="hint-link" id="ob-hint" style="background:none;border:none;width:100%;">${t('ob.emailHint')}</button>
            <div class="s2-hero"><img src="ChatGPT Image 2026년 7월 9일 오후 07_27_26 1.png" alt="학교 인증 일러스트" /></div>
            <section class="cta-section">
              <button class="cta-button" type="button" id="ob-verify">${t('ob.verifyBtn')}</button>
            </section>
          </section>

          <section class="screen" data-screen="2" aria-label="온보딩 3 - 관심사 선택">
            <div class="s3-top-row">
              <button class="back-btn" type="button" id="ob-back-2" aria-label="${t('ob.prevAria')}">
                <span class="icon" style="${iconMask('mdi:chevron-left')};width:28px;height:28px;"></span>
              </button>
              <div class="stepper">
                <div class="dot done"><span class="icon" style="${iconMask('mdi:check-bold')}"></span></div>
                <div class="line"></div>
                <div class="dot done"><span class="icon" style="${iconMask('mdi:check-bold')}"></span></div>
                <div class="line"></div>
                <div class="dot current">3</div>
              </div>
              <div class="s3-top-row-spacer" aria-hidden="true"></div>
            </div>
            <div class="s3-heading">
              <h1>${t('ob.interestTitle')}</h1>
              <p>${t('ob.interestDescPre')}<span class="accent">${t('ob.interestDescAccent')}</span></p>
            </div>
            <div class="interest-grid" id="interestGrid"></div>
            <p class="s3-counter" id="s3Counter"><b>0</b>${t('ob.counterNeedSuffix')}</p>
            <section class="cta-section">
              <button class="cta-button" type="button" id="finishBtn" disabled>${t('ob.finishBtn')}</button>
            </section>
          </section>

        </div>
      </div>`;
  },

  init(){
    const track = APP.querySelector('#track');
    let current = 0;
    function goTo(idx){
      current = Math.max(0, Math.min(2, idx));
      track.style.transform = `translateX(-${current * 33.3333}%)`;
    }
    APP.querySelector('#ob-start').addEventListener('click', () => goTo(1));
    APP.querySelector('#ob-back-1').addEventListener('click', () => goTo(0));
    APP.querySelector('#ob-back-2').addEventListener('click', () => goTo(1));
    APP.querySelector('#ob-hint').addEventListener('click', () => {});

    const emailInput = APP.querySelector('#schoolEmail');
    const placeholderSub = APP.querySelector('.placeholder-sub');
    const originalPlaceholder = emailInput.placeholder;
    emailInput.addEventListener('focus', () => {
      emailInput.placeholder = '';
      placeholderSub.classList.add('hide');
    });
    emailInput.addEventListener('blur', () => {
      if(!emailInput.value){
        emailInput.placeholder = originalPlaceholder;
        placeholderSub.classList.remove('hide');
      }
    });

    APP.querySelector('#ob-verify').addEventListener('click', () => {
      const box = APP.querySelector('#schoolInputBox');
      const val = emailInput.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if(!valid){
        box.classList.add('error');
        box.animate(
          [{ transform:'translateX(0)' },{ transform:'translateX(-6px)' },{ transform:'translateX(6px)' },{ transform:'translateX(0)' }],
          { duration:280 }
        );
        return;
      }
      box.classList.remove('error');
      goTo(2);
    });

    const interests = [
      { label:'디자인',        icon:'iconoir:design-pencil' },
      { label:'IT / 개발',     icon:'iconoir:code' },
      { label:'영상 / 미디어', icon:'iconoir:play' },
      { label:'마케팅',        icon:'iconoir:megaphone' },
      { label:'여행 / 캠핑',   icon:'streamline:camping-tent' },
      { label:'사진',          icon:'iconoir:camera' },
      { label:'음악',          icon:'iconoir:music-note' },
      { label:'창업',          icon:'iconoir:light-bulb' },
      { label:'인문 / 사회',   icon:'iconoir:book' },
    ];
    const selected = new Set();
    const grid = APP.querySelector('#interestGrid');
    const counterEl = APP.querySelector('#s3Counter');
    const finishBtn = APP.querySelector('#finishBtn');

    interests.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tile';
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = `
        <span class="icon" style="${iconMask(item.icon)}"></span>
        <span class="label">${translateTag(item.label)}</span>
        <span class="check-dot"><span class="icon" style="${iconMask('mdi:check-bold')}"></span></span>
      `;
      btn.addEventListener('click', () => {
        if(selected.has(i)){ selected.delete(i); btn.classList.remove('selected'); btn.setAttribute('aria-pressed','false'); }
        else{ selected.add(i); btn.classList.add('selected'); btn.setAttribute('aria-pressed','true'); }
        updateCounter();
      });
      grid.appendChild(btn);
    });

    function updateCounter(){
      const n = selected.size;
      if(n >= 3){
        counterEl.innerHTML = `<b>${n}</b>${t('ob.counterDoneSuffix')}`;
        finishBtn.disabled = false;
      } else {
        counterEl.innerHTML = `<b>${n}</b>${t('ob.counterNeedSuffix')}`;
        finishBtn.disabled = true;
      }
    }

    finishBtn.addEventListener('click', () => {
      if(selected.size < 3) return;
      finishBtn.textContent = t('ob.finishDone');
      finishBtn.disabled = true;
      const labels = Array.from(selected).map(i => interests[i].label);
      setTimeout(() => {
        localStorage.setItem('campick.onboarded', '1');
        localStorage.setItem('campick.interests', JSON.stringify(labels));
        /* 새로 고른 관심사로 가입 목록을 다시 만들도록 비운다 */
        localStorage.removeItem(JOINED_KEY);
        location.hash = '#/home';
      }, 1200);
    });
  }
};

/* ════════════════════════════════════════════════════════════
   화면: 홈
   ════════════════════════════════════════════════════════════ */
const ViewHome = {
  render(){
    return `
      <div class="app-wrap"><div class="app">
        <div class="topbar">
          <div class="school-pill">
            <span class="icon" style="${iconMask('iconoir:map-pin')}"></span>
            <span>오산대학교</span>
            <span class="icon chev" style="${iconMask('iconoir:nav-arrow-down')}"></span>
          </div>
          <div class="topbar-actions">
            <button class="lang-btn" id="langBtn" aria-label="${t('home.langAria')}">
              <span class="icon" style="${iconMask('iconoir:language')}"></span>
              <span class="lang-code">${currentLang.toUpperCase()}</span>
              <span class="icon chev" style="${iconMask('iconoir:nav-arrow-down')}"></span>
            </button>
            <button class="bell-btn" aria-label="${t('home.notifAria')}">
              <span class="icon" style="${iconMask('iconoir:bell')}"></span>
              <span class="dot"></span>
            </button>
          </div>
        </div>

        <div class="search-bar" id="homeSearchBar">
          <span class="icon" style="${iconMask('iconoir:search')}"></span>
          <span>${t('home.searchPlaceholder')}</span>
        </div>

        <section class="section">
          <div class="section-title"><h2>${t('home.todayPick')}</h2></div>
          <div class="pick-scroll" id="pickScroll"></div>
          <div class="pick-dots" id="pickDots"></div>
        </section>

        <section class="section" style="margin-top:26px;">
          <div class="section-title">
            <h2>${t('home.recommend')}</h2>
            <a class="more" href="#/search">${t('home.more')}</a>
          </div>
          <div class="rec-chips" id="recChips"></div>
          <div id="recList"></div>
        </section>
      </div></div>
      ${renderBottomNav('home')}
      <div class="lang-sheet-overlay" id="langOverlay">
        <div class="lang-sheet">
          <div class="lang-sheet-title">${t('lang.sheetTitle')}</div>
          <div class="lang-sheet-list" id="langList"></div>
        </div>
      </div>`;
  },

  init(){
    APP.querySelector('#homeSearchBar').addEventListener('click', () => location.hash = '#/search');

    const langOverlay = APP.querySelector('#langOverlay');
    const langList = APP.querySelector('#langList');
    langList.innerHTML = LANGS.map(l => `
      <button type="button" class="lang-option ${l.code === currentLang ? 'active' : ''}" data-lang="${l.code}">
        <span>${l.native}</span>
        ${l.code === currentLang ? `<span class="icon" style="${iconMask('mdi:check-bold')}"></span>` : ''}
      </button>
    `).join('');
    APP.querySelector('#langBtn').addEventListener('click', () => langOverlay.classList.add('open'));
    langOverlay.addEventListener('click', (e) => { if(e.target === langOverlay) langOverlay.classList.remove('open'); });
    langList.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.lang;
        if(code !== currentLang){
          currentLang = code;
          localStorage.setItem('campick.lang', code);
        }
        langOverlay.classList.remove('open');
        renderRoute();
      });
    });

    const picks = [
      { tag:{ko:'교내 소식', en:'Campus News', zh:'校内消息', ja:'学内お知らせ'}, title:{ko:'2026학년도 1학기 수강 정정 안내', en:'2026 Spring Semester Course Change Notice', zh:'2026学年第1学期选课变更通知', ja:'2026年度1学期履修訂正のお知らせ'}, icon:'iconoir:journal-page', img:'https://images.unsplash.com/photo-1741061966372-8e7e2c221de7?w=800&h=400&fit=crop&q=80' },
      { tag:{ko:'추천 공모전', en:'Featured Contest', zh:'推荐竞赛', ja:'おすすめコンテスト'}, title:{ko:'전국 대학생 아이디어 공모전 대상 상금 500만원', en:'National Student Idea Contest — 5M Won Grand Prize', zh:'全国大学生创意大赛 大奖奖金500万韩元', ja:'全国大学生アイデアコンテスト 大賞賞金500万ウォン'}, icon:'iconoir:trophy', img:'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=800&h=400&fit=crop&q=80' },
    ];
    APP.querySelector('#pickScroll').innerHTML = picks.map(p => `
      <div class="pick-card" style="background-image:url('${p.img}');">
        <span class="icon icon-wm" style="${iconMask(p.icon)}"></span>
        <div class="pick-text">
          <div class="pick-tag">${ct(p.tag)}</div>
          <div class="pick-title">${ct(p.title)}</div>
        </div>
      </div>
    `).join('');

    const pickScroll = APP.querySelector('#pickScroll');
    const pickDots = APP.querySelector('#pickDots');
    pickDots.innerHTML = picks.map((_, i) => `<span class="${i===0?'active':''}"></span>`).join('');
    const dotEls = pickDots.querySelectorAll('span');

    let pickIndex = 0;
    let autoTimer = null;
    function cardStep(){
      const card = pickScroll.querySelector('.pick-card');
      return card ? card.getBoundingClientRect().width + 12 : pickScroll.clientWidth;
    }
    function goToPick(i){
      pickIndex = (i + picks.length) % picks.length;
      pickScroll.scrollTo({ left: pickIndex * cardStep(), behavior:'smooth' });
      dotEls.forEach((d, idx) => d.classList.toggle('active', idx === pickIndex));
    }
    function startAuto(){ stopAuto(); autoTimer = setInterval(() => goToPick(pickIndex + 1), 3500); }
    function stopAuto(){ if(autoTimer) clearInterval(autoTimer); }
    let scrollDebounce;
    pickScroll.addEventListener('scroll', () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const idx = Math.round(pickScroll.scrollLeft / cardStep());
        pickIndex = Math.max(0, Math.min(picks.length - 1, idx));
        dotEls.forEach((d, i) => d.classList.toggle('active', i === pickIndex));
      }, 80);
    });
    pickScroll.addEventListener('pointerdown', stopAuto);
    pickScroll.addEventListener('pointerup', () => setTimeout(startAuto, 2000));
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      startAuto();
    }
    // stop the slider's interval once this view is torn down
    ViewHome._cleanup = stopAuto;

    const selectedInterests = loadInterests();

    let items = CONTENTS.filter(it => selectedInterests.includes(it.tags[0]));
    if(items.length < 6){
      const rest = CONTENTS.filter(it => !items.includes(it));
      items = items.concat(rest.slice(0, 6 - items.length));
    }
    items = items.slice(0, 7);

    APP.querySelector('#recChips').innerHTML = selectedInterests.length
      ? selectedInterests.map(tagChip).join('')
      : '';

    APP.querySelector('#recList').innerHTML = items.map(it => `
      <div class="list-card" data-route="#/detail">
        <div class="thumb" style="background-image:url('${it.img}'); background-color:${(TAG_COLORS[it.tags[0]]||DEFAULT_TAG).fg};">
          <span class="icon" style="${iconMask(it.icon)}"></span>
        </div>
        <div class="list-body">
          <p class="list-title">${ct(it.title)}</p>
          <div class="tag-row">${it.tags.map(tagChip).join('')}</div>
          <div class="deadline ${it.urgent ? 'urgent' : ''}">${t('common.deadlineLabel', it.deadline)}</div>
        </div>
      </div>
    `).join('');
    APP.querySelectorAll('#recList .list-card').forEach(card => {
      card.addEventListener('click', () => location.hash = card.dataset.route);
    });
  }
};

/* ════════════════════════════════════════════════════════════
   화면: 탐색 (검색)
   ════════════════════════════════════════════════════════════ */
const ViewSearch = {
  render(){
    return `
      <div class="app-wrap"><div class="app">
        <div class="topbar"><h1>${t('search.title')}</h1></div>
        <div class="search-bar">
          <span class="icon" style="${iconMask('iconoir:search')}"></span>
          <input type="search" placeholder="${t('search.searchPlaceholder')}" />
        </div>
        <div class="chip-scroll" id="popularChips"></div>
        <div class="filter-row">
          <div class="segmented" id="segmented"></div>
          <div class="sort-btn">
            <span>${t('search.sortDeadline')}</span>
            <span class="icon" style="${iconMask('iconoir:nav-arrow-down')}"></span>
          </div>
        </div>
        <div class="list" id="resultList"></div>
      </div></div>
      ${renderBottomNav('search')}`;
  },

  init(){
    const popular = [
      {ko:'디자인 공모전', en:'Design Contest', zh:'设计大赛', ja:'デザインコンテスト'},
      {ko:'데이터 분석', en:'Data Analysis', zh:'数据分析', ja:'データ分析'},
      {ko:'창업 아이템', en:'Startup Ideas', zh:'创业项目', ja:'起業アイデア'},
      {ko:'해커톤', en:'Hackathon', zh:'黑客马拉松', ja:'ハッカソン'},
      {ko:'스터디 모집', en:'Study Group', zh:'学习小组招募', ja:'スタディ募集'},
    ];
    APP.querySelector('#popularChips').innerHTML = popular.map(p => `<div class="chip">${ct(p)}</div>`).join('');

    const segments = ['전체','대외활동','스터디','공모전'];
    APP.querySelector('#segmented').innerHTML = segments.map((s,i) => `<button class="${i===0?'active':''}">${s === '전체' ? t('search.filterAll') : translateTag(s)}</button>`).join('');
    APP.querySelectorAll('.segmented button').forEach(btn => {
      btn.addEventListener('click', () => {
        APP.querySelectorAll('.segmented button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const results = pickContents(['korea-design','data-study','esg-hack']);
    APP.querySelector('#resultList').innerHTML = results.map(r => `
      <div class="card" data-route="#/detail">
        <div class="tag-row">${r.tags.map(tagChip).join('<span class="sep">ㅣ</span>')}</div>
        <p class="card-title">${ct(r.title)}</p>
        <p class="card-desc">${ct(r.desc)}</p>
        <div class="card-foot">
          <span class="deadline">${t('common.deadlineLabel', r.deadline)}</span>
          <div class="stat-row">
            <span class="stat"><span class="icon" style="${iconMask('iconoir:eye-empty')}"></span>${r.eye}</span>
            <span class="stat"><span class="icon" style="${iconMask('iconoir:message-text')}"></span>${r.comment}</span>
          </div>
        </div>
      </div>
    `).join('');
    APP.querySelectorAll('#resultList .card').forEach(card => {
      card.addEventListener('click', () => location.hash = card.dataset.route);
    });
  }
};

/* ════════════════════════════════════════════════════════════
   커뮤니티(공간) 데이터
   커뮤니티는 학교 하나 + 관심사별 공간들로 이루어진다.
   관심사 공간의 이름은 태그 번역을 그대로 쓰므로 따로 번역하지 않는다.
   ════════════════════════════════════════════════════════════ */
const SCHOOL_NAME = { ko:'오산대학교', en:'Osan University', zh:'乌山大学', ja:'烏山大学' };

const COMMUNITIES = [
  { id:'school',    type:'school',   name:SCHOOL_NAME,      icon:'iconoir:graduation-cap', members:3421 },
  { id:'it',        type:'interest', tag:'IT / 개발',        icon:'iconoir:code',           members:2148 },
  { id:'design',    type:'interest', tag:'디자인',           icon:'iconoir:design-pencil',  members:1876 },
  { id:'contest',   type:'interest', tag:'공모전',           icon:'iconoir:trophy',         members:2603 },
  { id:'study',     type:'interest', tag:'스터디',           icon:'iconoir:group',          members:1512 },
  { id:'startup',   type:'interest', tag:'창업',             icon:'iconoir:light-bulb',     members:948  },
  { id:'photo',     type:'interest', tag:'사진',             icon:'iconoir:camera',         members:1124 },
  { id:'music',     type:'interest', tag:'음악',             icon:'iconoir:music-note',     members:873  },
  { id:'travelcamp',type:'interest', tag:'여행 / 캠핑',      icon:'iconoir:map',            members:1338 },
  { id:'marketing', type:'interest', tag:'마케팅',           icon:'iconoir:megaphone',      members:1047 },
  { id:'media',     type:'interest', tag:'영상 / 미디어',    icon:'iconoir:play',           members:762  },
];
function findCommunity(id){ return COMMUNITIES.find(c => c.id === id) || null; }
function communityName(c){
  return c.type === 'school' ? ct(c.name) : translateTag(c.tag) + t('community.communitySuffix');
}

/* 온보딩에서 고른 관심사 (홈 추천과 같은 값을 읽는다) */
function loadInterests(){
  try{
    const raw = JSON.parse(localStorage.getItem('campick.interests') || '[]');
    return Array.isArray(raw) ? raw : [];
  }catch(e){ return []; }
}

/* 가입 목록 — 저장된 값이 없으면 학교 + 고른 관심사로 처음 한 번 구성한다 */
const JOINED_KEY = 'campick.communities';
function saveJoined(ids){
  try{ localStorage.setItem(JOINED_KEY, JSON.stringify(ids)); }catch(e){ /* 저장 실패해도 화면은 그대로 */ }
}
function joinedIds(){
  try{
    const raw = JSON.parse(localStorage.getItem(JOINED_KEY));
    if(Array.isArray(raw)) return raw;
  }catch(e){ /* 값이 깨졌으면 아래에서 다시 만든다 */ }
  const interests = loadInterests();
  const ids = ['school'].concat(
    COMMUNITIES.filter(c => c.tag && interests.includes(c.tag)).map(c => c.id)
  );
  saveJoined(ids);
  return ids;
}
function isJoined(id){ return joinedIds().includes(id); }
function toggleJoin(id){
  const ids = joinedIds();
  const i = ids.indexOf(id);
  if(i >= 0) ids.splice(i, 1); else ids.push(id);
  saveJoined(ids);
  return i < 0;                    // true면 방금 가입한 것
}

/* 상대 시간 — 커뮤니티 글 목록에서만 쓴다 */
function timeAgo(ts){
  const diff = Math.max(0, Date.now() - ts);
  const hour = Math.floor(diff / 3600000);
  if(hour < 1) return t('community.timeNow');
  if(hour < 24) return t('community.timeHour', hour);
  return t('community.timeDay', Math.floor(hour / 24));
}

const COMM_AUTHORS = [
  { ko:'김하늘',   en:'Haneul K.',  zh:'金河娜',     ja:'キム・ハヌル' },
  { ko:'박도윤',   en:'Doyun P.',   zh:'朴道润',     ja:'パク・ドユン' },
  { ko:'이서현',   en:'Seohyun L.', zh:'李瑞贤',     ja:'イ・ソヒョン' },
  { ko:'최민재',   en:'Minjae C.',  zh:'崔敏宰',     ja:'チェ・ミンジェ' },
];

/* 커뮤니티별 샘플 게시글 — hours는 '몇 시간 전'에 쓰인다 */
const COMM_POSTS = [
  { community:'school', author:0, hours:2,  like:24, comment:11, title:{ko:'중앙도서관 시험기간 자리 상황 공유해요',en:'Sharing library seat availability during finals',zh:'分享考试期间中央图书馆座位情况',ja:'中央図書館の試験期間の座席状況を共有します'} },
  { community:'school', author:2, hours:7,  like:18, comment:9,  title:{ko:'이번 학기 교양 추천 좀 부탁드려요',en:'Any recommendations for electives this term?',zh:'求推荐这学期的通识课',ja:'今学期の教養科目のおすすめを教えてください'} },
  { community:'school', author:1, hours:26, like:31, comment:14, title:{ko:'학교 축제 부스 운영 후기',en:'Recap of running a festival booth',zh:'校庆摆摊经营后记',ja:'学園祭ブース運営のレビュー'} },
  { community:'it',     author:3, hours:1,  like:12, comment:5,  title:{ko:'알고리즘 스터디 같이 하실 분 계신가요',en:'Anyone up for an algorithm study group?',zh:'有人一起参加算法学习小组吗',ja:'アルゴリズムスタディを一緒にやりませんか'} },
  { community:'it',     author:0, hours:9,  like:27, comment:16, title:{ko:'첫 백엔드 인턴 면접 후기 남깁니다',en:'Notes from my first backend internship interview',zh:'第一次后端实习面试后记',ja:'初めてのバックエンドインターン面接のレビュー'} },
  { community:'it',     author:2, hours:30, like:15, comment:4,  title:{ko:'해커톤 팀 구성할 때 뭘 먼저 정하나요?',en:'What do you decide first when forming a hackathon team?',zh:'组黑客松队伍时先定什么？',ja:'ハッカソンのチーム編成で最初に決めることは？'} },
  { community:'design', author:1, hours:3,  like:22, comment:8,  title:{ko:'졸업작품 준비 팀 공유합니다!',en:'Sharing our capstone project team!',zh:'分享我们的毕业设计团队！',ja:'卒業作品準備チームをシェアします！'} },
  { community:'design', author:3, hours:12, like:19, comment:7,  title:{ko:'포트폴리오 첫 장 어떻게 구성하셨어요?',en:'How did you lay out your portfolio cover?',zh:'作品集第一页你们怎么排的？',ja:'ポートフォリオの1ページ目はどう構成しましたか？'} },
  { community:'contest',author:0, hours:5,  like:33, comment:12, title:{ko:'공모전 수상 후 상금 지급까지 얼마나 걸렸나요',en:'How long until prize money arrives after winning?',zh:'获奖后奖金多久到账？',ja:'受賞後、賞金の支払いまでどれくらいかかりましたか'} },
  { community:'contest',author:2, hours:20, like:16, comment:6,  title:{ko:'서류 탈락만 세 번째인데 조언 구합니다',en:'Rejected at the document stage three times — advice?',zh:'已经三次书面落选，求建议',ja:'書類選考で3回落ちました。アドバイスをください'} },
  { community:'study',  author:1, hours:4,  like:14, comment:10, title:{ko:'토익 스터디 인원 두 자리 남았어요',en:'Two spots left in our TOEIC study group',zh:'托业学习小组还剩两个名额',ja:'TOEICスタディ、残り2席です'} },
  { community:'study',  author:3, hours:33, like:11, comment:3,  title:{ko:'스터디 벌금 제도 효과 있나요?',en:'Do study-group penalty fees actually work?',zh:'学习小组的罚款制度有用吗？',ja:'スタディの罰金制度は効果ありますか？'} },
  { community:'startup',author:2, hours:6,  like:20, comment:9,  title:{ko:'교내 창업지원단 상담 받아봤습니다',en:'I visited the campus startup support center',zh:'去了校内创业支援团咨询',ja:'学内の起業支援団に相談してきました'} },
  { community:'photo',  author:0, hours:8,  like:25, comment:5,  title:{ko:'교정 야경 찍기 좋은 자리 추천',en:'Best spots for campus night photography',zh:'推荐校园夜景拍摄地点',ja:'キャンパスの夜景撮影におすすめの場所'} },
  { community:'music',  author:1, hours:15, like:13, comment:6,  title:{ko:'합주실 예약 어떻게 하시나요',en:'How do you book the practice room?',zh:'合奏室怎么预约？',ja:'リハーサル室の予約はどうしていますか'} },
  { community:'travelcamp',author:3,hours:11,like:17, comment:8, title:{ko:'2박 3일 제주 예산 짜봤어요',en:'Budget plan for a 3-day Jeju trip',zh:'做了济州三天两夜的预算',ja:'2泊3日の済州島の予算を組んでみました'} },
  { community:'marketing',author:2,hours:18,like:12, comment:4,  title:{ko:'서포터즈 활동 시간 얼마나 드나요',en:'How much time do supporter programs take?',zh:'支持者活动要花多少时间？',ja:'サポーターズ活動はどのくらい時間がかかりますか'} },
  { community:'media',  author:0, hours:22, like:10, comment:3,  title:{ko:'편집 프로그램 뭐 쓰시나요',en:'Which editing software do you use?',zh:'你们用什么剪辑软件？',ja:'編集ソフトは何を使っていますか'} },
];

/* 커뮤니티별 모집글 */
const COMM_RECRUITS = [
  { community:'it',      tag:'스터디',   cur:3, max:5,  org:{ko:'IT/개발 · 서울',en:'IT/Dev · Seoul',zh:'IT/开发 · 首尔',ja:'IT/開発 · ソウル'},      title:{ko:'프론트엔드 스터디 팀원 모집',en:'Frontend Study Group Members Wanted',zh:'招募前端学习小组成员',ja:'フロントエンドスタディメンバー募集'} },
  { community:'it',      tag:'해커톤',   cur:2, max:4,  org:{ko:'IT/개발 · 전국',en:'IT/Dev · Nationwide',zh:'IT/开发 · 全国',ja:'IT/開発 · 全国'},     title:{ko:'ESG 해커톤 같이 나갈 팀원 구해요',en:'Looking for teammates for the ESG hackathon',zh:'招募一起参加ESG黑客松的队友',ja:'ESGハッカソンに一緒に出るメンバー募集'} },
  { community:'design',  tag:'프로젝트', cur:2, max:4,  org:{ko:'기획 · 오산대',en:'Planning · Osan Univ.',zh:'企划 · 乌山大学',ja:'企画 · 烏山大'},      title:{ko:'앱 서비스 기획 프로젝트 팀원 구해요!',en:'Looking for App Planning Project Members!',zh:'招募App服务企划项目成员！',ja:'アプリサービス企画プロジェクトメンバー募集！'} },
  { community:'marketing',tag:'대외활동',cur:5, max:10, org:{ko:'마케팅 · 전국',en:'Marketing · Nationwide',zh:'市场营销 · 全国',ja:'マーケティング · 全国'}, title:{ko:'대학생 마케팅 서포터즈 15기 모집',en:'15th College Marketing Supporters',zh:'第15期大学生市场营销支持者招募',ja:'大学生マーケティングサポーターズ15期募集'} },
  { community:'study',   tag:'스터디',   cur:4, max:6,  org:{ko:'어학 · 오산대',en:'Language · Osan Univ.',zh:'语言 · 乌山大学',ja:'語学 · 烏山大'},      title:{ko:'토익 900점 목표 스터디원 모집',en:'TOEIC 900 target study group',zh:'招募托业900分目标学习小组',ja:'TOEIC900点目標スタディメンバー募集'} },
  { community:'school',  tag:'행사',     cur:8, max:15, org:{ko:'교내 · 오산대',en:'On campus · Osan Univ.',zh:'校内 · 乌山大学',ja:'学内 · 烏山大'},     title:{ko:'교내 체육대회 학과 대표팀 모집',en:'Department team for the campus sports day',zh:'招募校内运动会学科代表队',ja:'学内体育大会の学科代表チーム募集'} },
  { community:'travelcamp',tag:'번개',   cur:3, max:6,  org:{ko:'여행 · 제주',en:'Travel · Jeju',zh:'旅行 · 济州',ja:'旅行 · 済州'},                    title:{ko:'제주도 2박 3일 번개 여행 인원 모집',en:'Jeju 3-day meetup trip — join us',zh:'招募济州岛3天2夜快闪旅行成员',ja:'済州島2泊3日突発旅行メンバー募集'} },
];

/* 샘플 글 + 내가 쓴 글을 한 커뮤니티 기준으로 합친다.
   커뮤니티가 지정되지 않은 예전 글은 학교 커뮤니티에 둔다. */
function communityPosts(id){
  const mine = loadPosts()
    .filter(p => (p.community || 'school') === id)
    .map(p => ({
      author: null, title: escapeHtml(p.title), tag: p.category,
      like: 0, comment: 0, createdAt: p.createdAt, route: '#/detail/' + p.id, mine: true,
    }));
  const samples = COMM_POSTS
    .filter(p => p.community === id)
    .map(p => ({
      author: ct(COMM_AUTHORS[p.author]), title: ct(p.title), tag: null,
      like: p.like, comment: p.comment, createdAt: Date.now() - p.hours * 3600000,
      route: '#/detail', mine: false,
    }));
  return mine.concat(samples);
}
function communityRecruits(id){ return COMM_RECRUITS.filter(r => r.community === id); }

/* ════════════════════════════════════════════════════════════
   화면: 커뮤니티
   ════════════════════════════════════════════════════════════ */
const ViewCommunity = {
  /* param이 없으면 커뮤니티 목록(허브), 있으면 그 커뮤니티 안 */
  render(param){
    return param ? renderCommunityRoom(param) : renderCommunityHub();
  },
  init(param){
    if(param) initCommunityRoom(param); else initCommunityHub();
  },
};

/* ── 커뮤니티 목록 (허브) ────────────────────────────────── */
function communityCardIcon(c){
  return `<span class="icon" style="${iconMask(c.icon)}"></span>`;
}
function communityBadge(c){
  return c.type === 'school' ? t('community.schoolBadge') : t('community.interestBadge');
}

function renderCommunityHub(){
  const joined = joinedIds();
  const mine = COMMUNITIES.filter(c => joined.includes(c.id));
  const rest = COMMUNITIES.filter(c => !joined.includes(c.id));
  const pick = rest[0] || null;              // 추천 배너: 아직 가입하지 않은 첫 커뮤니티

  return `
    <div class="app-wrap"><div class="app">
      <div class="topbar"><h1>${t('community.title')}</h1></div>

      <section class="section"><div class="section-title"><h2>${t('community.myCommunities')}</h2></div></section>
      ${mine.length ? `
        <div class="my-comm-scroll" id="myCommScroll">
          ${mine.map(c => `
            <div class="my-comm-card" data-id="${c.id}">
              <div class="my-comm-icon">${communityCardIcon(c)}</div>
              <p class="my-comm-name">${communityName(c)}</p>
              <span class="my-comm-meta">${t('community.posts', communityPosts(c.id).length)}</span>
            </div>
          `).join('')}
        </div>
      ` : `<p class="comm-empty">${t('community.myEmpty')}</p>`}

      ${pick ? `
        <div class="comm-banner" id="commBanner" data-id="${pick.id}" role="button" tabindex="0">
          <span class="icon icon-wm" style="${iconMask(pick.icon)}"></span>
          <div class="eyebrow">${t('community.bannerEyebrow')}</div>
          <h3>${communityName(pick)}</h3>
          <div class="members">
            <span class="icon" style="${iconMask('iconoir:group')}"></span>
            ${t('community.members', pick.members.toLocaleString())}
          </div>
        </div>
      ` : ''}

      <section class="section"><div class="section-title"><h2>${t('community.browseTitle')}</h2></div></section>
      <div class="comm-list" id="commList">
        ${COMMUNITIES.map(c => {
          const on = joined.includes(c.id);
          return `
          <div class="comm-row" data-id="${c.id}">
            <div class="comm-row-icon ${c.type}">${communityCardIcon(c)}</div>
            <div class="comm-row-body">
              <p class="comm-row-name">${communityName(c)}</p>
              <span class="comm-row-meta">${communityBadge(c)} · ${t('community.members', c.members.toLocaleString())}</span>
            </div>
            <button type="button" class="join-btn ${on ? 'on' : ''}" data-join="${c.id}">
              ${on ? t('community.joined') : t('community.join')}
            </button>
          </div>`;
        }).join('')}
      </div>
    </div></div>
    ${renderBottomNav('community')}`;
}

function initCommunityHub(){
  const go = id => { location.hash = '#/community/' + id; };

  APP.querySelectorAll('.my-comm-card').forEach(card => {
    card.addEventListener('click', () => go(card.dataset.id));
  });

  const banner = APP.querySelector('#commBanner');
  if(banner){
    banner.addEventListener('click', () => go(banner.dataset.id));
    banner.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(banner.dataset.id); }
    });
  }

  APP.querySelectorAll('.comm-row').forEach(row => {
    row.addEventListener('click', e => {
      if(e.target.closest('.join-btn')) return;   // 가입 버튼은 진입이 아니라 토글
      go(row.dataset.id);
    });
  });

  APP.querySelectorAll('.join-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.join;
      if(isJoined(id) && !confirm(t('community.leaveConfirm'))) return;
      toggleJoin(id);
      renderRoute();                              // 내 커뮤니티 줄과 추천 배너를 함께 갱신
    });
  });
}

/* ── 커뮤니티 안 (글 목록) ──────────────────────────────── */
function renderCommunityRoom(id){
  const c = findCommunity(id);
  if(!c) return `<div class="app-wrap"><div class="app"></div></div>`;
  const on = isJoined(c.id);

  return `
    <div class="app-wrap"><div class="app comm-room">
      <div class="room-bar">
        <button class="icon-btn" type="button" id="roomBack" aria-label="${t('community.backAria')}">
          <span class="icon" style="${iconMask('iconoir:nav-arrow-left')}"></span>
        </button>
        <h1>${communityName(c)}</h1>
        <div class="spacer"></div>
      </div>

      <div class="room-hero">
        <span class="icon icon-wm" style="${iconMask(c.icon)}"></span>
        <span class="room-badge">${communityBadge(c)}</span>
        <h2>${communityName(c)}</h2>
        <div class="room-meta">
          <span class="icon" style="${iconMask('iconoir:group')}"></span>
          ${t('community.members', c.members.toLocaleString())}
          <span class="dot-sep"></span>
          ${t('community.posts', communityPosts(c.id).length)}
        </div>
        <button type="button" class="room-join ${on ? 'on' : ''}" id="roomJoin">
          ${on ? t('community.joined') : t('community.join')}
        </button>
      </div>

      <div class="tab-row" id="roomTabs"></div>
      <div class="room-body" id="roomBody"></div>
    </div></div>

    <button class="fab" type="button" id="writeFab">
      <span class="icon" style="${iconMask('iconoir:edit-pencil')}"></span>
      ${t('community.writeBtn')}
    </button>
    ${renderBottomNav('community')}`;
}

function initCommunityRoom(id){
  const c = findCommunity(id);
  if(!c){                                   // 없는 주소로 들어온 경우
    alert(t('community.notFound'));
    location.hash = '#/community';
    return;
  }

  APP.querySelector('#roomBack').addEventListener('click', () => { location.hash = '#/community'; });
  APP.querySelector('#writeFab').addEventListener('click', () => { location.hash = '#/write/' + c.id; });

  const joinBtn = APP.querySelector('#roomJoin');
  joinBtn.addEventListener('click', () => {
    if(isJoined(c.id) && !confirm(t('community.leaveConfirm'))) return;
    const nowJoined = toggleJoin(c.id);
    joinBtn.classList.toggle('on', nowJoined);
    joinBtn.textContent = nowJoined ? t('community.joined') : t('community.join');
  });

  /* 탭은 모두 '무엇을 볼까' 축으로 통일한다 — 인기 / 최신 / 모집 */
  const TABS = [
    { key:'popular', label:t('community.tabPopular') },
    { key:'latest',  label:t('community.tabLatest') },
    { key:'recruit', label:t('community.tabRecruit') },
  ];
  const tabRow = APP.querySelector('#roomTabs');
  const body = APP.querySelector('#roomBody');

  tabRow.innerHTML = TABS.map((tab, i) =>
    `<div class="tab ${i === 0 ? 'active' : ''}" data-key="${tab.key}">${tab.label}</div>`
  ).join('');

  tabRow.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabRow.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      tab.classList.add('active');
      drawTab(tab.dataset.key);
    });
  });

  function drawTab(key){
    if(key === 'recruit'){ drawRecruits(); return; }
    const posts = communityPosts(c.id);
    posts.sort(key === 'popular'
      ? (a, b) => (b.like + b.comment) - (a.like + a.comment)
      : (a, b) => b.createdAt - a.createdAt);
    drawPosts(posts);
  }

  function drawPosts(posts){
    if(!posts.length){ body.innerHTML = `<p class="comm-empty">${t('community.emptyFeed')}</p>`; return; }
    body.innerHTML = `<div class="feed-list">${posts.map(p => `
      <div class="feed-card" data-route="${p.route}">
        <div class="feed-head">
          <span class="feed-author">${p.author || t('post.mine')}</span>
          <span class="dot-sep"></span>
          <span class="feed-time">${timeAgo(p.createdAt)}</span>
          ${p.mine ? `<span class="mine-badge">${t('post.mine')}</span>` : ''}
        </div>
        <p class="feed-title">${p.title}</p>
        <div class="feed-stats">
          <span class="stat"><span class="icon" style="${iconMask('iconoir:heart')}"></span>${p.like}</span>
          <span class="stat"><span class="icon" style="${iconMask('iconoir:message-text')}"></span>${p.comment}</span>
        </div>
      </div>`).join('')}</div>`;
    bindRoutes();
  }

  function drawRecruits(){
    const list = communityRecruits(c.id);
    if(!list.length){ body.innerHTML = `<p class="comm-empty">${t('community.emptyRecruit')}</p>`; return; }
    body.innerHTML = `<div class="recruit-list">${list.map(r => {
      const color = TAG_COLORS[r.tag] || DEFAULT_TAG;
      const pct = Math.round(r.cur / r.max * 100);
      return `
      <div class="recruit-card" data-route="#/detail">
        <div class="recruit-body">
          <span class="recruit-tag" style="background:${color.bg};color:${color.fg};">${translateTag(r.tag)}</span>
          <p class="recruit-title">${ct(r.title)}</p>
          <span class="recruit-org">${ct(r.org)}</span>
        </div>
        <div class="recruit-cap">
          <span class="num">${r.cur}/${r.max}${t('community.peopleUnit')}</span>
          <div class="cap-bar"><div class="cap-bar-fill" style="width:${pct}%;"></div></div>
        </div>
      </div>`;
    }).join('')}</div>`;
    bindRoutes();
  }

  function bindRoutes(){
    body.querySelectorAll('[data-route]').forEach(el => {
      el.addEventListener('click', () => { location.hash = el.dataset.route; });
    });
  }

  drawTab('popular');
}

/* ════════════════════════════════════════════════════════════
   화면: 상세보기
   ════════════════════════════════════════════════════════════ */
const DETAIL_SAMPLE = {
  title:{ko:'2026 UI/UX 디자인 공모전', en:'2026 UI/UX Design Contest', zh:'2026 UI/UX设计大赛', ja:'2026 UI/UXデザインコンテスト'},
  desc:{
    ko:'사용자 경험을 혁신할 수 있는 창의적인<br>UI/UX 디자인을 기다립니다.',
    en:'We’re looking for creative UI/UX designs<br>that can reinvent the user experience.',
    zh:'期待能够革新用户体验的<br>富有创意的UI/UX设计作品。',
    ja:'ユーザー体験を革新できる創造的な<br>UI/UXデザインをお待ちしています。',
  },
};

const ViewDetail = {
  /* 저장된 내 글 (#/detail/<id>) — 샘플 공모전 상세와 레이아웃이 다르다 */
  renderUserPost(post){
    const c = TAG_COLORS[post.category] || DEFAULT_TAG;
    const hero = post.photos.length
      ? `<div class="hero" style="background-image:url('${post.photos[0]}');">`
      : `<div class="hero">
           <span class="icon icon-wm" style="${iconMask('iconoir:edit-pencil')}"></span>`;
    return `
      <div class="app">
        ${hero}
          <div class="hero-topbar">
            <button class="round-btn" id="detailBack" aria-label="${t('detail.backAria')}">
              <span class="icon" style="${iconMask('iconoir:nav-arrow-left')}"></span>
            </button>
          </div>
        </div>

        <div class="content">
          <span class="cat-badge" style="background:${c.bg};color:${c.fg};">${translateTag(post.category)}</span>
          <h1 class="title">${escapeHtml(post.title)}</h1>
          <div class="title-meta">
            <span class="subtag">${t('post.mine')}</span>
            <span class="dot-sep"></span>
            <span class="subtag">${postDate(post.createdAt)}</span>
          </div>

          <p class="post-body">${escapeHtml(post.content)}</p>

          ${post.photos.length > 1 ? `<div class="post-photos">
            ${post.photos.slice(1).map(src => `<img src="${src}" alt="">`).join('')}
          </div>` : ''}
        </div>
      </div>

      <div class="cta-wrap">
        <div class="cta-inner">
          <button class="cta-btn danger" id="deletePostBtn">${t('post.deleteBtn')}</button>
        </div>
      </div>`;
  },

  render(param){
    const post = param ? loadPosts().find(p => p.id === param) : null;
    if(post) return this.renderUserPost(post);

    return `
      <div class="app">
        <div class="hero" style="background-image:url('https://images.unsplash.com/photo-1602576666092-bf6447a729fc?w=900&h=530&fit=crop&q=80');">
          <span class="icon icon-wm" style="${iconMask('iconoir:trophy')}"></span>
          <div class="hero-topbar">
            <button class="round-btn" id="detailBack" aria-label="${t('detail.backAria')}">
              <span class="icon" style="${iconMask('iconoir:nav-arrow-left')}"></span>
            </button>
            <button class="round-btn" id="saveBtn" aria-label="${t('detail.saveAria')}">
              <span class="icon" id="saveIcon" style="${iconMask('iconoir:bookmark')}"></span>
            </button>
          </div>
        </div>

        <div class="content">
          <span class="cat-badge">${translateTag('공모전')}</span>
          <h1 class="title">${ct(DETAIL_SAMPLE.title)}</h1>
          <div class="title-meta">
            <span class="deadline">${t('common.deadlineLabel', '~05.20')}</span>
            <span class="dot-sep"></span>
            <span class="subtag">${translateTag('디자인')}</span>
          </div>

          <div class="info-grid" id="infoGrid"></div>

          <div class="section">
            <h2>${t('detail.introTitle')}</h2>
            <p class="desc">${ct(DETAIL_SAMPLE.desc)}</p>
          </div>

          <div class="hashtag-row" id="hashtags"></div>

          <div class="section">
            <h2>${t('detail.periodTitle')}</h2>
            <div class="period-card">
              <div class="icon-box"><span class="icon" style="${iconMask('iconoir:calendar')}"></span></div>
              <div>
                <div class="p-label">${t('detail.periodTitle')}</div>
                <div class="p-value">2026.04.01(수) ~ 2026.05.20(수) 23:59</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cta-wrap">
        <div class="cta-inner">
          <button class="cta-btn" id="applyBtn">${t('detail.applyBtn')}</button>
        </div>
      </div>`;
  },

  init(param){
    const post = param ? loadPosts().find(p => p.id === param) : null;
    if(post){
      /* 글이 속한 커뮤니티로 돌아간다 (커뮤니티가 없던 예전 글은 목록으로) */
      const back = post.community && findCommunity(post.community)
        ? '#/community/' + post.community
        : '#/community';
      APP.querySelector('#detailBack').addEventListener('click', () => location.hash = back);
      APP.querySelector('#deletePostBtn').addEventListener('click', () => {
        if(!confirm(t('post.deleteConfirm'))) return;
        deletePost(post.id);
        location.hash = back;
      });
      return;
    }
    if(param){                       // 삭제됐거나 없는 id
      alert(t('post.notFound'));
      location.hash = '#/community';
      return;
    }

    const info = [
      { label:t('info.host'), value:'한국디자인진흥원', icon:'iconoir:building' },
      { label:t('info.target'), value:'전국 대학(원)생', icon:'iconoir:group' },
      { label:t('info.method'), value:'홈페이지 접수', icon:'iconoir:send' },
      { label:t('info.prize'), value:'총 상금 1,000만원', icon:'iconoir:trophy' },
    ];
    APP.querySelector('#infoGrid').innerHTML = info.map(i => `
      <div class="info-item">
        <div class="icon-box"><span class="icon" style="${iconMask(i.icon)}"></span></div>
        <div class="info-text">
          <div class="info-label">${i.label}</div>
          <div class="info-value">${i.value}</div>
        </div>
      </div>
    `).join('');

    const tags = ['#UIUX','#디자인','#아이디어','#공모전'];
    APP.querySelector('#hashtags').innerHTML = tags.map(t => `<span class="hashtag">${t}</span>`).join('');

    APP.querySelector('#detailBack').addEventListener('click', () => history.back());

    let saved = false;
    APP.querySelector('#saveBtn').addEventListener('click', () => {
      saved = !saved;
      APP.querySelector('#saveBtn').classList.toggle('saved', saved);
      APP.querySelector('#saveIcon').style.cssText = iconMask(saved ? 'iconoir:bookmark-solid' : 'iconoir:bookmark');
    });

    APP.querySelector('#applyBtn').addEventListener('click', () => alert(t('detail.applyAlert')));
  }
};

/* ════════════════════════════════════════════════════════════
   화면: 저장
   ════════════════════════════════════════════════════════════ */
const ViewSave = {
  render(){
    return `
      <div class="app-wrap"><div class="app">
        <div class="topbar">
          <h1>${t('save.title')}</h1>
          <button class="edit-btn" id="editBtn">${t('save.edit')}</button>
        </div>
        <div class="meta-row">
          <span class="count">${t('save.total')} <b id="totalCount">12</b></span>
          <div class="sort-btn">
            <span>${t('save.sortLatest')}</span>
            <span class="icon" style="${iconMask('iconoir:nav-arrow-down')}"></span>
          </div>
        </div>
        <div class="list" id="savedList"></div>
      </div></div>
      ${renderBottomNav('save')}`;
  },

  init(){
    const saved = pickContents(['korea-design','data-study','esg-hack']);

    const listEl = APP.querySelector('#savedList');
    listEl.innerHTML = saved.map((it, i) => `
      <div class="card" data-idx="${i}">
        <div class="checkbox" id="chk-${i}"><span class="icon" style="${iconMask('iconoir:check')}"></span></div>
        <div class="card-main">
          <div class="tag-row">${it.tags.map(tagChip).join('')}</div>
          <p class="card-title">${ct(it.title)}</p>
          <p class="card-desc">${ct(it.desc)}</p>
          <div class="card-foot">
            <span class="deadline">${t('common.deadlineLabel', it.deadline)}</span>
            <div class="stat-row">
              <span class="stat"><span class="icon" style="${iconMask('iconoir:eye-empty')}"></span>${it.eye}</span>
              <span class="stat"><span class="icon" style="${iconMask('iconoir:message-text')}"></span>${it.comment}</span>
            </div>
          </div>
        </div>
        <button class="bookmark-btn" data-unsave="${i}" aria-label="${t('save.unsaveAria')}">
          <span class="icon" style="${iconMask('iconoir:bookmark-solid')}"></span>
        </button>
      </div>
    `).join('');

    let editMode = false;
    const selected = new Set();
    const editBtn = APP.querySelector('#editBtn');
    editBtn.addEventListener('click', () => {
      editMode = !editMode;
      listEl.classList.toggle('edit-mode', editMode);
      editBtn.textContent = editMode ? t('save.done') : t('save.edit');
      if(!editMode) selected.clear();
      APP.querySelectorAll('.checkbox').forEach(c => c.classList.remove('checked'));
    });

    listEl.querySelectorAll('.card').forEach(card => {
      const i = Number(card.dataset.idx);
      card.addEventListener('click', (e) => {
        if(e.target.closest('[data-unsave]')) return;
        if(editMode){
          const chk = APP.querySelector('#chk-'+i);
          if(selected.has(i)){ selected.delete(i); chk.classList.remove('checked'); }
          else{ selected.add(i); chk.classList.add('checked'); }
        } else {
          location.hash = '#/detail';
        }
      });
    });
    listEl.querySelectorAll('[data-unsave]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        APP.querySelector(`.card[data-idx="${btn.dataset.unsave}"]`).style.display = 'none';
      });
    });
  }
};

/* ════════════════════════════════════════════════════════════
   화면: 마이페이지
   ════════════════════════════════════════════════════════════ */
const ViewMypage = {
  render(){
    return `
      <div class="app-wrap"><div class="app">
        <div class="topbar"><h1>${t('mypage.title')}</h1></div>

        <div class="profile-card">
          <div class="profile-top">
            <div class="avatar">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="프로필 사진">
                <defs>
                  <linearGradient id="avBg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#eef1ff"/><stop offset="1" stop-color="#e2e6ff"/>
                  </linearGradient>
                  <linearGradient id="avCloth" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#4d78fb"/><stop offset="1" stop-color="#7e3efc"/>
                  </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#avBg)"/>
                <path d="M40 200 C42 168 66 150 100 150 C134 150 158 168 160 200 Z" fill="url(#avCloth)"/>
                <path d="M100 150 C86 150 74 156 66 165 C78 160 90 158 100 158 C110 158 122 160 134 165 C126 156 114 150 100 150 Z" fill="#ffffff" opacity="0.18"/>
                <path d="M86 128 L86 146 C86 152 114 152 114 146 L114 128 Z" fill="#eab98f"/>
                <path d="M86 128 L86 138 C90 143 110 143 114 138 L114 128 Z" fill="#dda87d" opacity="0.55"/>
                <path d="M56 96 C56 58 74 40 100 40 C126 40 144 58 144 96 C144 116 140 128 136 138 C138 118 138 96 132 84 C130 110 128 120 124 128 L76 128 C72 120 70 110 68 84 C62 96 62 118 64 138 C60 128 56 116 56 96 Z" fill="#211d33"/>
                <ellipse cx="61" cy="100" rx="8" ry="11" fill="#f6cfa9"/>
                <ellipse cx="139" cy="100" rx="8" ry="11" fill="#f6cfa9"/>
                <ellipse cx="61" cy="100" rx="3.4" ry="5.5" fill="#e3ad80"/>
                <ellipse cx="139" cy="100" rx="3.4" ry="5.5" fill="#e3ad80"/>
                <path d="M67 92 C67 66 82 52 100 52 C118 52 133 66 133 92 C133 114 118 130 100 130 C82 130 67 114 67 92 Z" fill="#f6cfa9"/>
                <ellipse cx="80" cy="104" rx="8" ry="5" fill="#f2a98f" opacity="0.42"/>
                <ellipse cx="120" cy="104" rx="8" ry="5" fill="#f2a98f" opacity="0.42"/>
                <path d="M65 92 C63 62 80 46 100 46 C120 46 137 62 135 92 C135 84 132 78 128 74 C126 82 122 86 118 87 C120 80 119 74 116 71 C112 80 104 83 100 83 C96 83 88 80 84 71 C81 74 80 80 82 87 C78 86 74 82 72 74 C68 78 65 84 65 92 Z" fill="#211d33"/>
                <path d="M76 88 C80 85 86 85 90 87" stroke="#2b2438" stroke-width="2.6" stroke-linecap="round" fill="none"/>
                <path d="M110 87 C114 85 120 85 124 88" stroke="#2b2438" stroke-width="2.6" stroke-linecap="round" fill="none"/>
                <path d="M77 97 C81 93 88 93 92 97 C88 100 81 100 77 97 Z" fill="#2b2438"/>
                <path d="M108 97 C112 93 119 93 123 97 C119 100 112 100 108 97 Z" fill="#2b2438"/>
                <circle cx="85.5" cy="96.4" r="1.4" fill="#ffffff" opacity="0.85"/>
                <circle cx="116.5" cy="96.4" r="1.4" fill="#ffffff" opacity="0.85"/>
                <path d="M99 100 C98 105 97 108 100 110 C102 109 103 107 102 104" stroke="#e3ad80" stroke-width="2" stroke-linecap="round" fill="none"/>
                <path d="M91 116 C96 121 104 121 109 116" stroke="#c96a5c" stroke-width="2.6" stroke-linecap="round" fill="none"/>
              </svg>
            </div>
            <div class="profile-info">
              <p class="profile-name">김캠픽</p>
              <p class="profile-dept">오산대학교 디지털콘텐츠디자인학과</p>
              <span class="verified-badge">
                <span class="icon" style="${iconMask('iconoir:badge-check')}"></span>
                ${t('mypage.verifiedBadge')}
              </span>
            </div>
          </div>
          <div class="stat-row">
            <div class="stat-item"><div class="stat-num">12</div><div class="stat-label">${t('mypage.statSaved')}</div></div>
            <div class="stat-item"><div class="stat-num">8</div><div class="stat-label">${t('mypage.statPosts')}</div></div>
            <div class="stat-item"><div class="stat-num">34</div><div class="stat-label">${t('mypage.statActivities')}</div></div>
          </div>
        </div>

        <div class="mypage-section">
          <div class="section-head"><h2>${t('mypage.interestManage')}</h2><button class="link-btn">${t('mypage.editLink')}</button></div>
          <div class="chip-wrap">
            <span class="chip">${translateTag('디자인')}</span><span class="chip">${translateTag('공모전')}</span><span class="chip">${translateTag('스터디')}</span>
            <span class="chip">앱디자인</span><span class="chip">UI/UX</span>
          </div>
        </div>

        <div class="mypage-section">
          <div class="verify-row">
            <div class="verify-icon"><span class="icon" style="${iconMask('iconoir:graduation-cap')}"></span></div>
            <div class="verify-text">
              <b>${t('mypage.schoolVerify')}</b>
              <span>오산대학교 (${t('mypage.verifiedShort')})</span>
            </div>
          </div>
        </div>

        <div class="section-label">${t('mypage.settingsLabel')}</div>
        <div class="menu-list" id="menuList"></div>
      </div></div>
      ${renderBottomNav('mypage')}`;
  },

  init(){
    const menu = [
      { label:t('menu.notif'), icon:'iconoir:bell' },
      { label:t('menu.support'), icon:'iconoir:headset-help' },
      { label:t('menu.notice'), icon:'iconoir:megaphone' },
      { label:t('menu.privacy'), icon:'iconoir:privacy-policy' },
      { label:t('menu.terms'), icon:'iconoir:page' },
      { label:t('menu.logout'), icon:'iconoir:log-out', danger:true, action:'logout' },
    ];
    APP.querySelector('#menuList').innerHTML = menu.map(m => `
      <div class="menu-item ${m.danger?'danger':''}" ${m.action ? `data-action="${m.action}"` : ''}>
        <div class="icon-box"><span class="icon" style="${iconMask(m.icon)}"></span></div>
        <span class="label">${m.label}</span>
        ${m.danger ? '' : `<span class="icon chev" style="${iconMask('iconoir:nav-arrow-right')}"></span>`}
      </div>
    `).join('');

    const logoutBtn = APP.querySelector('[data-action="logout"]');
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('campick.onboarded');
      localStorage.removeItem(JOINED_KEY);
      location.hash = '#/onboarding';
    });
  }
};

/* ════════════════════════════════════════════════════════════
   화면: 글쓰기
   ════════════════════════════════════════════════════════════ */
const WRITE_CATEGORIES = ['자유','스터디','프로젝트','대외활동'];

const ViewWrite = {
  render(param){
    const target = param ? findCommunity(param) : null;
    return `
      <div class="app">
        <div class="topbar">
          <button class="round-btn" id="writeBack" aria-label="${t('write.backAria')}">
            <span class="icon" style="${iconMask('iconoir:nav-arrow-left')}"></span>
          </button>
          <h1>${t('write.title')}</h1>
          <div class="spacer"></div>
        </div>

        <div class="form-wrap">
          ${target ? `
          <div class="field-group">
            <span class="field-label">${t('write.postingTo')}</span>
            <div class="post-target">
              <span class="icon" style="${iconMask(target.icon)}"></span>
              ${communityName(target)}
            </div>
          </div>` : ''}

          <div class="field-group">
            <span class="field-label">${t('write.category')}</span>
            <div class="category-row" id="categoryRow"></div>
          </div>

          <div class="field-group">
            <input id="titleInput" class="title-input" placeholder="${t('write.titlePlaceholder')}" maxlength="50" />
            <span class="char-count" id="titleCount">0/50</span>
          </div>

          <div class="field-group">
            <textarea id="contentInput" class="content-input" placeholder="${t('write.contentPlaceholder')}" maxlength="1000"></textarea>
            <span class="char-count" id="contentCount">0/1000</span>
          </div>

          <div class="field-group">
            <span class="field-label">${t('write.photoLabel')} <span id="photoCount">(0/${MAX_PHOTOS})</span></span>
            <div class="photo-row" id="photoRow">
              <button type="button" class="photo-add" id="photoAddBtn">
                <span class="icon" style="${iconMask('iconoir:camera')}"></span>
                <span>${t('write.addPhoto')}</span>
              </button>
            </div>
            <input type="file" id="photoInput" accept="image/*" multiple hidden />
          </div>
        </div>
      </div>

      <div class="cta-wrap">
        <div class="cta-inner">
          <button class="cta-btn" id="submitBtn" disabled>
            <span class="spinner"></span>
            <span id="submitLabel">${t('write.submit')}</span>
          </button>
        </div>
      </div>

      <div class="toast" id="writeToast">
        <span class="icon" style="${iconMask('iconoir:check-circle')}"></span>
        ${t('write.success')}
      </div>`;
  },

  init(param){
    const target = param && findCommunity(param) ? param : null;
    const backHash = target ? '#/community/' + target : '#/community';
    let selectedCategory = null;
    const categoryRow = APP.querySelector('#categoryRow');
    categoryRow.innerHTML = WRITE_CATEGORIES.map(label => {
      const c = TAG_COLORS[label] || DEFAULT_TAG;
      return `<button type="button" class="category-chip" data-label="${label}" style="--cat-color:${c.fg};--cat-bg:${c.bg};">${translateTag(label)}</button>`;
    }).join('');
    categoryRow.querySelectorAll('.category-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        categoryRow.querySelectorAll('.category-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedCategory = chip.dataset.label;
        validate();
      });
    });

    const titleInput = APP.querySelector('#titleInput');
    const titleCount = APP.querySelector('#titleCount');
    titleInput.addEventListener('input', () => {
      titleCount.textContent = `${titleInput.value.length}/50`;
      titleCount.classList.toggle('limit', titleInput.value.length >= 50);
      validate();
    });

    const contentInput = APP.querySelector('#contentInput');
    const contentCount = APP.querySelector('#contentCount');
    contentInput.addEventListener('input', () => {
      contentCount.textContent = `${contentInput.value.length}/1000`;
      contentCount.classList.toggle('limit', contentInput.value.length >= 1000);
      validate();
    });

    let photos = [];
    const photoRow = APP.querySelector('#photoRow');
    const photoAddBtn = APP.querySelector('#photoAddBtn');
    const photoInput = APP.querySelector('#photoInput');
    const photoCount = APP.querySelector('#photoCount');

    photoAddBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', async () => {
      const files = Array.from(photoInput.files).slice(0, MAX_PHOTOS - photos.length);
      photoInput.value = '';
      for(const file of files){
        try{
          photos.push(await downscaleImage(file));
          renderPhotos();
        }catch(e){ /* 읽을 수 없는 파일은 건너뛴다 */ }
      }
    });

    function renderPhotos(){
      photoRow.querySelectorAll('.photo-thumb').forEach(el => el.remove());
      photos.forEach((src, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'photo-thumb';
        thumb.innerHTML = `<img src="${src}" alt=""><button type="button" class="remove" data-idx="${i}" aria-label="${t('write.removePhotoAria')}"><span class="icon" style="${iconMask('iconoir:xmark')}"></span></button>`;
        photoRow.insertBefore(thumb, photoAddBtn);
      });
      photoCount.textContent = `(${photos.length}/${MAX_PHOTOS})`;
      photoAddBtn.disabled = photos.length >= MAX_PHOTOS;
      photoRow.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', () => { photos.splice(Number(btn.dataset.idx), 1); renderPhotos(); });
      });
    }

    const submitBtn = APP.querySelector('#submitBtn');
    const submitLabel = APP.querySelector('#submitLabel');
    function validate(){
      submitBtn.disabled = !selectedCategory || !titleInput.value.trim() || !contentInput.value.trim();
    }

    submitBtn.addEventListener('click', () => {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitLabel.textContent = t('write.submitting');

      const ok = savePost({
        id: 'p' + Date.now(),
        category: selectedCategory,
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
        photos: photos.slice(),
        community: target,
        createdAt: Date.now(),
      });

      if(!ok){
        submitBtn.classList.remove('loading');
        submitLabel.textContent = t('write.submit');
        submitBtn.disabled = false;
        alert(t('write.saveFailed'));
        return;
      }

      setTimeout(() => {
        APP.querySelector('#writeToast').classList.add('show');
        setTimeout(() => { location.hash = backHash; }, 900);
      }, 600);
    });

    APP.querySelector('#writeBack').addEventListener('click', () => {
      const dirty = !!selectedCategory || titleInput.value.trim() || contentInput.value.trim() || photos.length;
      if(dirty && !confirm(t('write.leaveConfirm'))) return;
      location.hash = backHash;
    });
  }
};

/* ── router ──────────────────────────────────────────────── */
const VIEWS = {
  onboarding: ViewOnboarding,
  home: ViewHome,
  search: ViewSearch,
  community: ViewCommunity,
  write: ViewWrite,
  detail: ViewDetail,
  save: ViewSave,
  mypage: ViewMypage,
};
const TITLE_KEYS = {
  onboarding: 'title.onboarding', home: 'nav.home', search: 'nav.search', community: 'nav.community',
  write: 'write.title', detail: 'title.detail', save: 'nav.save', mypage: 'nav.mypage',
};

function parseRoute(){
  const hash = location.hash.replace(/^#\/?/, '');
  const parts = hash.split('/').filter(Boolean);
  const name = VIEWS[parts[0]] ? parts[0] : 'home';
  return { name, param: parts[1] };
}

function renderRoute(){
  if(ViewHome._cleanup){ ViewHome._cleanup(); ViewHome._cleanup = null; }
  const { name, param } = parseRoute();
  const view = VIEWS[name];
  APP.className = 'view-' + name;
  APP.innerHTML = view.render(param);
  view.init(param);
  document.title = `CamPick · ${t(TITLE_KEYS[name])}`;
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', renderRoute);

function boot(){
  if(!location.hash){
    const onboarded = localStorage.getItem('campick.onboarded') === '1';
    location.hash = onboarded ? '#/home' : '#/onboarding';
  } else {
    renderRoute();
  }
}
boot();
