import Layout from "../../components/Layout";
import Head from "next/head";
import { request } from "graphql-request";
import { truncateSearch, truncateAlt, endpoint } from "../../utils/utils";
import Link from "next/link";
import Footer from "../../components/Footer";

const SEARCH_QUERY = `
  query search($author: String!, $title: String!) {
      search(author: $author, title: $title) {
        titleurl
        title
        author
        date
        url
      }
    }
`;

export async function getServerSideProps({ query }) {
  const variables = {
    author: `${query.author === undefined ? query.title : query.author}`,
    title: `${query.title === undefined ? query.author : query.title}`,
  };

  const res = await request(endpoint, SEARCH_QUERY, variables);
  const posts = await res.search;

  return {
    props: {
      posts,
    },
  };
}

export default function Index({ posts }) {
  const error = "No results found...";

  return (
    <Layout>
      <Head>
        <title> Search Locallog </title>
      </Head>
      <div
        style={{
          textAlign: "center",
          marginTop: posts.length === 0 ? "50px" : "1px",
        }}
      >
        {posts.length === 0 ? error : null}
      </div>

      <div className="category">
        <div className="category-items-wrap">
          {posts.map((post) => (
            <div key={post.title}>
              <Link href={`/post/${post.titleurl}`}>
                <a>
                  <div className="category-item">
                    <img src={post.url} alt={truncateAlt(post.title)} />
                    <div className="category-item-content">
                      <h5>{truncateSearch(post.title)}</h5>
                      <p style={{ margin: "5px 0" }}>{post.author}</p>
                      <h6>{post.date}</h6>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: posts.length < 8 ? "250px" : "10px",
          }}
        >
          <Footer />
        </div>
        <style jsx>{`
          .category {
            margin-top: 10px;
          }
          p {
            font-size: 14px;
          }
          h5,
          h6 {
            color: rgb(51, 62, 99);
          }
          h6 {
            font-size: 0.8rem;
          }
        `}</style>
      </div>
    </Layout>
  );
}
