import { Helmet } from "react-helmet";
import { FaOm,FaHeart,FaExclamationTriangle,FaHandsHelping,FaUsers, FaCheckCircle,FaQuestionCircle} from "react-icons/fa";
import "../styleSheets/Blog.css";

const Blog = () => {
  return (
    <div className="blog-page">
      <Helmet>
        <title>Spiritual Matrimony in India | Find a Devotee Life Partner</title>
        <meta
          name="description"
          content="Looking for spiritual matrimony in India? Discover how to find a devotee life partner through ISKCON, Isha & sect-based matchmaking platforms."
        />
      </Helmet>

      <article className="blog-article">
        <h1>
          {/* <FaOm className="" /> */}
          Spiritual Matrimony in India: How to Find a Life Partner on the Same Spiritual Path
        </h1>

        <p className="intro">
          In today’s fast-paced world, marriage is no longer just about matching caste,
          profession, or location. For many individuals and families, spiritual compatibility
          has become a top priority. This growing demand has led to the rise of spiritual
          matrimony in India.
        </p>

        <h2>
          <FaHeart className="blog-icon" /> What Is Spiritual Matrimony?
        </h2>
        <p>
          Spiritual matrimony focuses on shared spiritual beliefs, devotional practices,
          and value-based living rather than only caste or income.
        </p>

        <h2>
          <FaCheckCircle className="blog-icon" /> Why Spiritual Compatibility Is Important in Marriage
        </h2>
        <p>
          Spiritual alignment reduces conflicts related to lifestyle, food habits, rituals,
          and child upbringing, leading to peaceful and meaningful marriages.
        </p>

        <h2>
          <FaExclamationTriangle className="blog-icon warning" /> Problems With Traditional Matrimony Websites
        </h2>
        <ul>
          <li>Lack of spiritual or sect-based filters</li>
          <li>Expensive subscription plans</li>
          <li>Focus on quantity rather than value-based matches</li>
        </ul>

        <h2>
          <FaHandsHelping className="blog-icon" /> How Vivah Jeevan Helps You Find the Right Spiritual Match
        </h2>
        <p>
          Vivah Jeevan offers sect-based spiritual filters, simple onboarding, and
          affordable plans for individuals and parents seeking meaningful alliances.
        </p>

        <h2>
          <FaUsers className="blog-icon" /> Who Should Use a Spiritual Matrimony Platform?
        </h2>
        <p>
          Devotees, parents, and families who prioritize values, culture, and spiritual
          discipline should choose spiritual matrimony platforms.
        </p>

        <h2>
          <FaCheckCircle className="blog-icon success" /> Conclusion
        </h2>
        <p>
          Choosing a spiritually aligned life partner leads to long-term happiness and
          harmony. Spiritual matrimony bridges tradition and modern technology.
        </p>

        <h2>
          <FaQuestionCircle className="blog-icon" /> FAQs
        </h2>

        <div className="faq">
          <p><strong>1. What is spiritual matrimony in India?</strong><br />
            Spiritual matrimony matches individuals based on shared spiritual beliefs and values.
          </p>

          <p><strong>2. Which is the best spiritual matrimony app in India?</strong><br />
            Vivah Jeevan is designed specifically for spiritual and devotee matchmaking.
          </p>

          <p><strong>3. How does ISKCON matrimony work?</strong><br />
            It connects devotees following Krishna consciousness for marriage.
          </p>

          <p><strong>4. What is devotee matrimony?</strong><br />
            Devotee matrimony helps spiritually inclined individuals find compatible partners.
          </p>

          <p><strong>5. Why is spiritual compatibility important for marriage?</strong><br />
            It ensures harmony in lifestyle, beliefs, and long-term goals.
          </p>
        </div>
      </article>
    </div>
  );
};

export default Blog;
