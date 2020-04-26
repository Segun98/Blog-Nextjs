import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import ReactHtmlParser from "react-html-parser";
import ErrorMessage from "../../components/ErrorMessage";
import MostPopular from '../../components/MostPopular';
import Footer from '../../components/Footer'

const POST_QUERY = gql`
  query post($id: ID) {
    post(id: $id) {
      id
      title
      description
      count
      url
      author
      date
    }
  }
`;
export default function index() {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    fetchPost();
  }, []);

  const [underror, setunderror] = useState(false);

  const [graphpost, setgraphpost] = useState([]);

  const { loading, error, data } = useQuery(POST_QUERY, {
    variables: {
      id: id,
    },
    notifyOnNetworkStatusChange: true,
  });

  //checks to be sure the data is fully loaded
  if (loading) {
    const message = "Loading...";
    return <ErrorMessage message={message} />;
  }
  if (error) {
    const message =
      "Error fetching Data, refresh the page or check your internet connection";
    return <ErrorMessage message={message} />;
  }

  if (underror) {
    const message =
      "Error fetching Data, refresh the page or check your internet connection";
    return <ErrorMessage message={message} />;
  }

  function fetchPost() {
    try {
      const { post } = data;
      setgraphpost(post);
    } catch (err) {
      console.log(err.message);
      setunderror(true);
    }
  }

  function truncateAlt(str) {
    if (str.length > 20) {
      return str.slice(0, 20);
    } else {
      return str;
    }
  }

  return (
    <Layout>
      <Head>
        <title>{graphpost.title} | Tadlace</title>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        ></script>
      </Head>
      <div className="single-post">
        <div className="header-image">
          <img
            src={`${graphpost.url}`}
            alt={truncateAlt(`${graphpost.title}`)}
          />
        </div>
        <h2 className="single-post-title">{graphpost.title}</h2>
        <hr />
        <div className="post-sub-head">
          <div>
            <p>By - {graphpost.author}</p>
            <p>{graphpost.date}</p>
          </div>
          <aside style={{ display: "flex" }}>
            <div className="views-count">Views - {graphpost.count}</div>
            <div style={{ display: "flex" }}>
              <a
                href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                data-text={graphpost.title}
                data-show-count="true"
                className="twitter-share-button"
              >
                Tweet
              </a>
            </div>
          </aside>
        </div>
        <hr />
        <div className="single-post-body">
          {ReactHtmlParser(graphpost.description)}
        </div>
        <hr />
        <section style={{marginBottom:"20px"}}>
        <br/>
        <h2 style={{marginBottom:"15px"}}>Share Post</h2>
        <p>
        <a
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          data-text={graphpost.title}
          data-show-count="true"
          className="twitter-share-button"
        >
          Tweet
        </a>
        </p>
        </section>
        <MostPopular />
        <Footer />
      </div>
    </Layout>
  );
}
