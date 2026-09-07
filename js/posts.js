/* ============================================================
   CamPick — 사용자가 작성한 글 저장소
   백엔드가 없으므로 작성한 글은 브라우저(localStorage)에만 남는다.
   SPA(js/app.js)와 단독 페이지(write/community/detail.html)가
   같은 데이터를 공유하도록 이 파일 하나만 쓴다.
   ============================================================ */

const POSTS_KEY = 'campick.posts';
const MAX_PHOTOS = 5;

/* 글쓰기 카테고리 — 색상은 app.js의 TAG_COLORS와 맞춰 둔다 */
const POST_CATEGORIES = [
  { label:'자유',     fg:'#595e90', bg:'rgba(89,94,144,0.08)' },
  { label:'스터디',   fg:'#059669', bg:'#e8fbf0' },
  { label:'프로젝트', fg:'#7c3aed', bg:'#f2ecff' },
  { label:'대외활동', fg:'#dc2626', bg:'#fef2f2' },
];
function categoryColor(label){
  return POST_CATEGORIES.find(c => c.label === label) || POST_CATEGORIES[0];
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function loadPosts(){
  try{
    const raw = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  }catch(e){ return []; }
}

/* 저장 한도(보통 5MB)를 넘으면 오래된 글부터, 그래도 안 되면 사진을 버린다. */
function savePost(post){
  const posts = loadPosts();
  posts.unshift(post);
  while(posts.length){
    try{
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      return true;
    }catch(e){
      if(posts.length > 1){ posts.pop(); continue; }
      if(posts[0].photos.length){ posts[0].photos = []; continue; }
      return false;
    }
  }
  return false;
}

function deletePost(id){
  const posts = loadPosts().filter(p => p.id !== id);
  try{ localStorage.setItem(POSTS_KEY, JSON.stringify(posts)); }catch(e){ /* 지울 땐 넘칠 일이 없다 */ }
}

/* 원본 사진은 수 MB라 저장 한도를 바로 넘긴다. 긴 변 기준으로 줄여 JPEG로 재인코딩. */
function downscaleImage(file, maxSide = 1000, quality = 0.7){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function formatPostDate(ts, locale = 'ko-KR'){
  return new Date(ts).toLocaleDateString(locale, { year:'numeric', month:'2-digit', day:'2-digit' });
}
