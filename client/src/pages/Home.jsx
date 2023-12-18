import { useEffect, useState } from 'react'
import { Card, FormField, Loader } from '../components/index'

// eslint-disable-next-line react/prop-types
const RenderCards = ({ data, title }) => {
  // eslint-disable-next-line react/prop-types
  if (data?.length > 0) {
    const reversedData = [...data].reverse()
    // eslint-disable-next-line react/prop-types
    return reversedData.map((post) => <Card key={post._id} {...post} />)
  }
  return (
    <h2 key={title} className="mt-5 font-bold text-[#6449ff] text-xl uppercase">
      {title}
    </h2>
  )
}

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [searchTimeout, setSearchTimeout] = useState('')

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://dalle-2-0-26r1.onrender.com/api/v1/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const result = await response.json()

        setPosts(result.data)
      }
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false)
    }
  }
  //
  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSearchChange = (e) => {
    setSearchText(e.target.value)

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = posts.filter(
          (post) =>
            post.name.toLowerCase().includes(searchText.toLowerCase()) ||
            post.prompt.toLowerCase().includes(searchText.toLowerCase())
        )
        setSearchResults(searchResults)
      }, 500)
    )
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
          Browse through a collection of imaginative and visually stunning
          images generated by DALL-E (OpenAI’s Text-to-Image engine)
        </p>
      </div>
      <div className="mt-16 ">
        <FormField
          labelName={'Search posts'}
          type="text"
          name="text"
          placeholder="Write key words of what you are searching for to see if someone has already created it"
          value={searchText}
          handleChange={handleSearchChange}
          extraClass={'drop-shadow-md'}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75 text-xl mb-3]">
                {' '}
                Showing results for{' '}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3 ">
              {searchText ? (
                <RenderCards
                  data={searchResults}
                  title="No search results found"
                />
              ) : (
                <RenderCards data={posts} title="No posts found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Home;