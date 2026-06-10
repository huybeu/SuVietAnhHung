import { useEffect, useState, useCallback, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { fetchArticleAdmin, createArticle, updateArticle } from '../../lib/api'
import { slugifyVi, formatDate } from '../../lib/format'
import { can, useRole } from '../../lib/permissions'
import StatusBadge from '../ui/StatusBadge'

// ─── Schema ────────────────────────────────────────────────────────

const schema = z.object({
  title:       z.string().min(1, 'Vui lòng nhập tiêu đề').max(300),
  slug:        z.string().min(1).max(300).regex(/^[a-z0-9-]+$/, 'Chỉ chữ thường, số và dấu gạch ngang'),
  excerpt:     z.string().max(500).optional(),
  cover_url:   z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  status:      z.enum(['draft', 'published', 'archived']),
  published_at: z.string().optional(),
})

// ─── Tag Input ─────────────────────────────────────────────────────

function TagInput({ value = [], onChange, placeholder = 'Thêm tag...' }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  function add(tag) {
    const t = tag.trim().toLowerCase()
    if (t && !value.includes(t) && value.length < 10) onChange([...value, t])
    setInput('')
  }

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input) }
    if (e.key === 'Backspace' && !input && value.length) onChange(value.slice(0, -1))
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '0.5rem 0.75rem',
        background: 'rgba(10,4,2,0.8)', border: '1px solid rgba(246,190,59,0.25)',
        borderRadius: '0.4rem', minHeight: 42, cursor: 'text',
        transition: 'border-color 0.15s',
      }}
    >
      {value.map(tag => (
        <span key={tag} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
          background: 'rgba(246,190,59,0.1)', border: '1px solid rgba(246,190,59,0.3)',
          color: '#f6be3b', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 9999,
          fontFamily: 'Cinzel, serif',
        }}>
          {tag}
          <button type="button" onClick={(e) => { e.stopPropagation(); onChange(value.filter(t => t !== tag)) }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(246,190,59,0.6)', fontSize: '0.8rem', padding: 0, lineHeight: 1 }}>✕</button>
        </span>
      ))}
      <input
        ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
        placeholder={value.length === 0 ? placeholder : ''}
        style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e8dcc8', fontSize: '0.85rem', minWidth: 80, flex: 1 }}
      />
    </div>
  )
}

// ─── Slug Input ─────────────────────────────────────────────────────

function SlugInput({ value, onChange, isNew, isPublished }) {
  const [editing, setEditing]     = useState(isNew)
  const [status, setStatus]       = useState('idle')
  const [showWarn, setShowWarn]   = useState(false)
  const checkRef = useRef(null)

  function handleChange(e) {
    const v = e.target.value.replace(/[^a-z0-9-]/g, '')
    onChange(v)
    setStatus('checking')
    clearTimeout(checkRef.current)
    checkRef.current = setTimeout(() => setStatus('ok'), 500)
  }

  function startEdit() {
    if (isPublished && !isNew) setShowWarn(true)
    setEditing(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(10,4,2,0.8)', border: '1px solid rgba(246,190,59,0.2)', borderRadius: '0.4rem' }}>
        <span style={{ color: 'rgba(232,220,200,0.3)', fontSize: '0.8rem', flexShrink: 0, fontFamily: 'monospace' }}>🔗 /bai-viet/</span>
        {editing
          ? <input value={value} onChange={handleChange} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f6be3b', fontSize: '0.85rem', fontFamily: 'monospace', flex: 1 }} />
          : <span style={{ color: '#f6be3b', fontFamily: 'monospace', fontSize: '0.85rem', flex: 1 }}>{value || '...'}</span>
        }
        {status === 'checking' && <span style={{ width: 12, height: 12, border: '2px solid rgba(246,190,59,0.3)', borderTopColor: '#f6be3b', borderRadius: '50%', flexShrink: 0 }} className="animate-spin" />}
        {status === 'ok' && <span style={{ color: '#4ade80', fontSize: '0.8rem', flexShrink: 0 }}>✓</span>}
        {!editing && (
          <button type="button" onClick={startEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(232,220,200,0.4)', fontSize: '0.8rem', padding: '0 0.25rem' }}>✎</button>
        )}
      </div>
      {showWarn && (
        <div style={{ color: '#f6be3b', fontSize: '0.72rem', marginTop: '0.25rem' }}>
          ⚠ Đổi slug sẽ ảnh hưởng đến link đang chia sẻ
        </div>
      )}
    </div>
  )
}

// ─── Toolbar ───────────────────────────────────────────────────────

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button type="button" onClick={onClick} title={title}
      style={{
        width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '0.3rem', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
        background: active ? 'rgba(220,20,60,0.3)' : 'transparent',
        color: active ? '#f6be3b' : 'rgba(232,220,200,0.6)',
        transition: 'all 0.15s', fontFamily: 'Cinzel, serif', fontWeight: active ? 700 : 400,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background='rgba(220,20,60,0.15)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background='transparent' }}
    >{children}</button>
  )
}

function Sep() { return <div style={{ width: 1, height: 20, background: 'rgba(246,190,59,0.15)', margin: '0 0.2rem' }} /> }

function Toolbar({ editor }) {
  if (!editor) return null
  const e = editor

  function setLink() {
    const url = prompt('URL:')
    if (url) e.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.1rem',
      background: '#1b110d', border: '1px solid rgba(246,190,59,0.15)', borderBottom: 'none',
      borderRadius: '0.5rem 0.5rem 0 0', padding: '0.4rem 0.5rem',
    }}>
      <ToolbarBtn onClick={() => e.chain().focus().toggleHeading({level:1}).run()} active={e.isActive('heading',{level:1})} title="H1">H1</ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().toggleHeading({level:2}).run()} active={e.isActive('heading',{level:2})} title="H2">H2</ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().toggleHeading({level:3}).run()} active={e.isActive('heading',{level:3})} title="H3">H3</ToolbarBtn>
      <Sep />
      <ToolbarBtn onClick={() => e.chain().focus().toggleBold().run()}          active={e.isActive('bold')}          title="In đậm"><b>B</b></ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().toggleItalic().run()}        active={e.isActive('italic')}        title="Nghiêng"><i>I</i></ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().toggleStrike().run()}        active={e.isActive('strike')}        title="Gạch ngang"><s>S</s></ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().toggleHighlight().run()}     active={e.isActive('highlight')}     title="Nổi bật">✦</ToolbarBtn>
      <Sep />
      <ToolbarBtn onClick={() => e.chain().focus().toggleBlockquote().run()}    active={e.isActive('blockquote')}    title="Trích dẫn">❝</ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().toggleBulletList().run()}    active={e.isActive('bulletList')}    title="Danh sách">•</ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().toggleOrderedList().run()}   active={e.isActive('orderedList')}   title="Đánh số">1.</ToolbarBtn>
      <Sep />
      <ToolbarBtn onClick={() => e.chain().focus().setTextAlign('left').run()}    active={e.isActive({textAlign:'left'})}    title="Căn trái">⬅</ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().setTextAlign('center').run()}  active={e.isActive({textAlign:'center'})}  title="Căn giữa">↔</ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().setTextAlign('justify').run()} active={e.isActive({textAlign:'justify'})} title="Căn đều">≡</ToolbarBtn>
      <Sep />
      <ToolbarBtn onClick={setLink}                                               active={e.isActive('link')}         title="Liên kết">🔗</ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().undo().run()}                  active={false}                      title="Hoàn tác">↩</ToolbarBtn>
      <ToolbarBtn onClick={() => e.chain().focus().redo().run()}                  active={false}                      title="Làm lại">↪</ToolbarBtn>
      <div style={{ marginLeft: 'auto', color: 'rgba(232,220,200,0.3)', fontSize: '0.7rem', fontFamily: 'Cinzel, serif' }}>
        {e.storage?.characterCount?.characters() || 0} ký tự
      </div>
    </div>
  )
}

// ─── Article Editor ────────────────────────────────────────────────

export default function ArticleEditor({ articleId, onSaved }) {
  const role      = useRole()
  const readOnly  = !can(role, 'articles:write')
  const navigate  = useNavigate()
  const qc        = useQueryClient()

  const [saveStatus, setSaveStatus] = useState('idle')
  const [saveTime,   setSaveTime]   = useState(null)
  const [tags,       setTags]       = useState([])
  const [heroNames,  setHeroNames]  = useState([])
  const [showPreview, setPreview]   = useState(false)
  const [previewDevice, setDevice]  = useState('desktop')
  const [isDirty, setIsDirty]       = useState(false)
  const autosaveRef = useRef(null)

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', slug: '', excerpt: '', cover_url: '', status: 'draft', published_at: '' },
  })

  const titleValue = watch('title')
  const statusValue = watch('status')
  const coverValue  = watch('cover_url')

  // Fetch existing article
  useQuery({
    queryKey: ['article-admin', articleId],
    queryFn: () => fetchArticleAdmin(articleId),
    enabled: !!articleId,
    onSuccess: (res) => {
      const data = res?.data ?? res
      setValue('title', data.title || '')
      setValue('slug', data.slug || '')
      setValue('excerpt', data.excerpt || '')
      setValue('cover_url', data.cover_url || '')
      setValue('status', data.status || 'draft')
      setValue('published_at', data.published_at ? data.published_at.slice(0,16) : '')
      setTags(data.tags?.map(t => t.name || t) || [])
      setHeroNames(data.heroes?.map(h => h.name || h) || [])
      if (editor && data.content) editor.commands.setContent(data.content)
    },
  })

  const saveMutation = useMutation({
    mutationFn: (data) => articleId ? updateArticle(articleId, data) : createArticle(data),
    onSuccess: (res) => {
      setSaveStatus('saved'); setSaveTime(new Date()); setIsDirty(false)
      qc.invalidateQueries({ queryKey: ['articles'] })
      onSaved?.(res)
    },
    onError: () => setSaveStatus('error'),
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (!articleId && titleValue) setValue('slug', slugifyVi(titleValue))
  }, [titleValue, articleId])

  // Autosave (draft only, debounced 30s)
  useEffect(() => {
    if (!isDirty || statusValue !== 'draft') return
    clearTimeout(autosaveRef.current)
    autosaveRef.current = setTimeout(() => {
      const vals = { title: watch('title'), slug: watch('slug'), excerpt: watch('excerpt'), cover_url: watch('cover_url'), status: watch('status'), content: editor?.getHTML(), tags, hero_names: heroNames }
      setSaveStatus('saving')
      saveMutation.mutate(vals)
    }, 30000)
    return () => clearTimeout(autosaveRef.current)
  }, [isDirty, statusValue])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Bắt đầu kể câu chuyện lịch sử...' }),
      CharacterCount,
      TiptapImage,
      TiptapLink.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Typography,
    ],
    editorProps: { attributes: { class: 'ProseMirror' } },
    onUpdate: () => setIsDirty(true),
  })

  function buildPayload(formData) {
    return { ...formData, content: editor?.getHTML() || '', tags, hero_names: heroNames }
  }

  function handleSave() {
    handleSubmit((data) => { setSaveStatus('saving'); saveMutation.mutate(buildPayload(data)) })()
  }

  const saveStatusText = saveStatus === 'saving' ? 'Đang lưu...' : saveStatus === 'saved' ? `Đã lưu lúc ${saveTime ? saveTime.getHours()+':'+String(saveTime.getMinutes()).padStart(2,'0') : ''}` : saveStatus === 'error' ? 'Lưu thất bại' : isDirty ? 'Chưa lưu' : ''

  return (
    <div style={{ position: 'relative' }}>
      {/* Viewer banner */}
      {readOnly && (
        <div style={{ background: 'rgba(246,190,59,0.1)', border: '1px solid rgba(246,190,59,0.3)', borderRadius: '0.5rem', padding: '0.6rem 1rem', marginBottom: '1rem', color: '#f6be3b', fontSize: '0.85rem', fontFamily: 'Cinzel, serif' }}>
          👁 Chế độ Xem — Bạn không có quyền chỉnh sửa nội dung
        </div>
      )}

      {/* Top action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(246,190,59,0.12)' }}>
        <div className="font-cinzel" style={{ color: 'rgba(232,220,200,0.5)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          {articleId ? 'Chỉnh Sửa Bài Viết' : 'Bài Viết Mới'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: saveStatus === 'error' ? '#dc143c' : 'rgba(232,220,200,0.4)', fontSize: '0.75rem', fontFamily: 'Cinzel, serif' }}>{saveStatusText}</span>
          {!readOnly && (
            <>
              <button type="button" onClick={() => setPreview(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', border: '1px solid rgba(246,190,59,0.3)', borderRadius: '0.4rem', background: 'transparent', color: '#f6be3b', fontFamily: 'Cinzel, serif', fontSize: '0.78rem', cursor: 'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span> Xem Trước
              </button>
              <button type="button" onClick={handleSave} disabled={saveMutation.isPending}
                style={{ padding: '0.45rem 0.85rem', border: '1px solid rgba(246,190,59,0.4)', borderRadius: '0.4rem', background: 'transparent', color: '#f6be3b', fontFamily: 'Cinzel, serif', fontSize: '0.78rem', cursor: 'pointer' }}>
                Lưu Nháp
              </button>
              <button type="button" onClick={() => { setValue('status','published'); handleSave() }}
                className="btn-epic" style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}>
                Xuất Bản
              </button>
            </>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Editor column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <textarea
            {...register('title')}
            rows={2}
            placeholder="Tiêu đề bài viết..."
            readOnly={readOnly}
            onChange={(e) => { register('title').onChange(e); setIsDirty(true) }}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.4rem,3vw,1.8rem)',
              color: '#f2dfd6', lineHeight: 1.3, marginBottom: '0.75rem',
              borderBottom: '1px solid rgba(246,190,59,0.15)', paddingBottom: '0.5rem',
              boxSizing: 'border-box',
            }}
          />
          {errors.title && <div style={{ color: '#dc143c', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{errors.title.message}</div>}

          {/* Slug */}
          <div style={{ marginBottom: '1rem' }}>
            <Controller name="slug" control={control} render={({ field }) => (
              <SlugInput value={field.value} onChange={(v) => { field.onChange(v); setIsDirty(true) }} isNew={!articleId} isPublished={statusValue==='published'} />
            )} />
            {errors.slug && <div style={{ color: '#dc143c', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.slug.message}</div>}
          </div>

          {/* Excerpt */}
          <textarea
            {...register('excerpt')}
            rows={3} readOnly={readOnly}
            placeholder="Tóm tắt ngắn về bài viết..."
            onChange={(e) => { register('excerpt').onChange(e); setIsDirty(true) }}
            className="input-gold"
            style={{ width: '100%', resize: 'none', marginBottom: '1rem', boxSizing: 'border-box' }}
          />

          {/* Rich text */}
          <Toolbar editor={editor} />
          <div style={{ border: '1px solid rgba(246,190,59,0.15)', borderRadius: '0 0 0.5rem 0.5rem', background: '#0a0402', minHeight: 500, padding: '1rem' }}
            onClick={() => !readOnly && editor?.commands.focus()}>
            <EditorContent editor={editor} />
          </div>
          <div style={{ textAlign: 'right', color: 'rgba(232,220,200,0.3)', fontSize: '0.72rem', marginTop: '0.35rem' }}>
            {editor?.storage?.characterCount?.characters() || 0} ký tự
          </div>
        </div>

        {/* Meta sidebar */}
        <div style={{ width: 260, flexShrink: 0, position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Status */}
          <div className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1rem' }}>
            <div className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Xuất Bản</div>
            <select {...register('status')} disabled={readOnly}
              className="input-gold" style={{ width: '100%', marginBottom: '0.5rem' }}>
              <option value="draft">Nháp</option>
              <option value="published">Đã Xuất Bản</option>
              {can(role,'articles:archive') && <option value="archived">Lưu Trữ</option>}
            </select>
            <input type="datetime-local" {...register('published_at')} readOnly={readOnly}
              className="input-gold" style={{ width: '100%', fontSize: '0.8rem' }} />
          </div>

          {/* Cover */}
          <div className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1rem' }}>
            <div className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Ảnh Bìa</div>
            {coverValue && <img src={coverValue} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '0.4rem', marginBottom: '0.5rem' }} onError={e => e.target.style.display='none'} />}
            <input {...register('cover_url')} readOnly={readOnly} className="input-gold" style={{ width: '100%', fontSize: '0.8rem', boxSizing: 'border-box' }} placeholder="https://... URL ảnh bìa" />
            {errors.cover_url && <div style={{ color: '#dc143c', fontSize: '0.72rem', marginTop: '0.25rem' }}>{errors.cover_url.message}</div>}
          </div>

          {/* Tags */}
          <div className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1rem' }}>
            <div className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Thẻ Nội Dung</div>
            <TagInput value={tags} onChange={setTags} placeholder="Thêm thẻ..." />
            <div style={{ color: 'rgba(232,220,200,0.3)', fontSize: '0.7rem', marginTop: '0.3rem' }}>Enter hoặc dấu phẩy để thêm</div>
          </div>

          {/* Hero names */}
          <div className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1rem' }}>
            <div className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Anh Hùng Liên Quan</div>
            <TagInput value={heroNames} onChange={setHeroNames} placeholder="Tên anh hùng..." />
          </div>

          {/* Meta */}
          {articleId && (
            <div className="glass-panel" style={{ borderRadius: '0.75rem', padding: '1rem' }}>
              <div className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Thông Tin</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <StatusBadge status={statusValue} type="content" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview overlay */}
      {showPreview && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0a0402', overflow: 'auto' }}>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(246,190,59,0.1)', borderBottom: '1px solid rgba(246,190,59,0.2)', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="font-cinzel" style={{ color: '#f6be3b', fontSize: '0.78rem' }}>CHẾ ĐỘ XEM TRƯỚC — Chưa xuất bản</span>
            <button onClick={() => setDevice('mobile')} style={{ padding: '0.25rem 0.6rem', border: `1px solid ${previewDevice==='mobile' ? '#f6be3b' : 'rgba(246,190,59,0.3)'}`, borderRadius: '0.3rem', background: 'transparent', color: previewDevice==='mobile'?'#f6be3b':'rgba(232,220,200,0.5)', fontFamily:'Cinzel,serif', fontSize:'0.72rem', cursor:'pointer' }}>📱</button>
            <button onClick={() => setDevice('desktop')} style={{ padding: '0.25rem 0.6rem', border: `1px solid ${previewDevice==='desktop' ? '#f6be3b' : 'rgba(246,190,59,0.3)'}`, borderRadius: '0.3rem', background: 'transparent', color: previewDevice==='desktop'?'#f6be3b':'rgba(232,220,200,0.5)', fontFamily:'Cinzel,serif', fontSize:'0.72rem', cursor:'pointer' }}>🖥</button>
            <button onClick={() => setPreview(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(232,220,200,0.5)', fontSize: '1.1rem' }}>✕</button>
          </div>
          <div style={{ marginTop: 50, padding: '2rem 1.5rem', maxWidth: previewDevice==='mobile' ? 390 : undefined, margin: '50px auto 0' }}>
            <div className="hero-prose" dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }} />
          </div>
        </div>
      )}
    </div>
  )
}
