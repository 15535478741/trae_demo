## 1. Architecture Design
```mermaid
flowchart LR
    subgraph Frontend
        A[React Components] --> B[React Router]
        B --> C[Zustand State]
        C --> D[Supabase Client]
    end
    
    subgraph Backend
        E[Supabase Auth]
        F[Supabase Database]
        G[Supabase Storage]
    end
    
    subgraph External Services
        H[LLM API]
    end
    
    D --> E
    D --> F
    D --> G
    A --> H
```

## 2. Technology Description
- **Frontend**: React@18 + TypeScript + Tailwind CSS@3 + Vite
- **Initialization Tool**: vite-init (react-ts template)
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Authentication & Database**: Supabase
- **Icons**: Lucide React
- **External API**: LLM API for content analysis

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | 首页，检测入口 |
| /result/:id | 检测结果详情页 |
| /profile | 个人中心 |
| /login | 登录页面 |
| /register | 注册页面 |
| /settings | 设置页面（密码修改、主题设置） |

## 4. API Definitions

### 4.1 检测API（前端直连LLM）
```typescript
interface CheckRequest {
  content: string;
  type: 'text' | 'url';
}

interface CheckResult {
  id: string;
  content: string;
  type: 'text' | 'url';
  accuracyScore: number;
  sourceReliability: number;
  verdict: 'true' | 'false' | 'unknown';
  confidence: number;
  analysis: string;
  sources: SourceInfo[];
  createdAt: Date;
}

interface SourceInfo {
  url: string;
  reliability: number;
  description: string;
}
```

### 4.2 用户API（Supabase Auth）
- 注册：`supabase.auth.signUp()`
- 登录：`supabase.auth.signInWithPassword()`
- 登出：`supabase.auth.signOut()`
- 修改密码：`supabase.auth.updateUser()`

## 5. Server Architecture Diagram
```mermaid
flowchart TD
    A[Client] --> B[Supabase Auth]
    A --> C[Supabase Database]
    A --> D[LLM API]
    
    B --> E{Authentication}
    E -->|Valid| C
    E -->|Invalid| F[Error]
    
    C --> G[users table]
    C --> H[check_records table]
```

## 6. Data Model

### 6.1 Data Model Definition
```mermaid
erDiagram
    users ||--o{ check_records : "has"
    
    users {
        uuid id PK "用户ID"
        text email "邮箱"
        text username "用户名"
        text avatar_url "头像URL"
        text theme "主题颜色"
        timestamptz created_at "创建时间"
        timestamptz updated_at "更新时间"
    }
    
    check_records {
        uuid id PK "记录ID"
        uuid user_id FK "用户ID"
        text content "检测内容"
        text content_type "内容类型"
        int accuracy_score "准确性评分"
        int source_reliability "来源可靠性"
        text verdict "判定结果"
        int confidence "置信度"
        text analysis "分析报告"
        json sources "来源信息"
        timestamptz created_at "创建时间"
    }
```

### 6.2 Data Definition Language

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'blue',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE check_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  content_type TEXT NOT NULL,
  accuracy_score INTEGER,
  source_reliability INTEGER,
  verdict TEXT,
  confidence INTEGER,
  analysis TEXT,
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_check_records_user_id ON check_records(user_id);
CREATE INDEX idx_check_records_created_at ON check_records(created_at);

GRANT SELECT ON users TO anon;
GRANT ALL PRIVILEGES ON users TO authenticated;
GRANT SELECT ON check_records TO anon;
GRANT ALL PRIVILEGES ON check_records TO authenticated;
```

## 7. Project Structure

```
src/
├── components/
│   ├── Header.tsx
│   ├── SearchInput.tsx
│   ├── CheckButton.tsx
│   ├── ResultCard.tsx
│   ├── HistoryList.tsx
│   ├── ThemeSelector.tsx
│   └── LoadingSpinner.tsx
├── pages/
│   ├── Home.tsx
│   ├── Result.tsx
│   ├── Profile.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Settings.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCheck.ts
│   └── useTheme.ts
├── store/
│   └── useStore.ts
├── utils/
│   ├── supabase.ts
│   └── api.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```