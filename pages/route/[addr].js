import { useRouter } from 'next/router'

const Post = () => {
    const router = useRouter()
    const { addr } = router.query

    return <p>Post: {addr}</p>
}

export default Post