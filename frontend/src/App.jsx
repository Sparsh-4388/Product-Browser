import { useState, useEffect, useCallback, useRef } from 'react'

const API_BASE = 'https://product-browser-1p1u.onrender.com/api/products'
const CATEGORIES = ['Electronics', 'Books', 'Fashion', 'Sports', 'Gaming']
const PAGE_SIZE = 20

export default function App() {
  const [category, setCategory] = useState('')
  const [products, setProducts] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const seenIds = useRef(new Set())

  const fetchPage = useCallback(async (cursorArg, reset) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('limit', PAGE_SIZE)
      if (category) params.set('category', category)
      if (cursorArg) params.set('cursor', cursorArg)

      const res = await fetch(`${API_BASE}?${params.toString()}`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Unknown error')

      const fresh = data.products.filter(p => !seenIds.current.has(p._id))
      fresh.forEach(p => seenIds.current.add(p._id))

      setProducts(prev => (reset ? fresh : [...prev, ...fresh]))
      setCursor(data.nextCursor)
      setHasMore(Boolean(data.nextCursor) && data.count === PAGE_SIZE)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    seenIds.current = new Set()
    setProducts([])
    setCursor(null)
    setHasMore(true)
    fetchPage(null, true)
  }, [category])

  const loadMore = () => {
    if (!loading && hasMore) fetchPage(cursor, false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Product Browser</h1>
        <p className="subtitle">~200,000 products · newest first · cursor pagination</p>
        <div className="controls">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </header>

      {error && <div className="error">Error: {error}</div>}

      <div className="grid">
        {products.map(p => (
          <div className="card" key={p._id}>
            <div className="card-name">{p.name}</div>
            <div className="card-category">{p.category}</div>
            <div className="card-date">
              {new Date(p.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="footer">
        {hasMore ? (
          <button onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load more'}
          </button>
        ) : (
          <span className="end-message">
            {products.length === 0 && !loading ? 'No products found.' : 'No more products.'}
          </span>
        )}
      </div>
    </div>
  )
}
