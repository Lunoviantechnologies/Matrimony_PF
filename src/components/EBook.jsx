import { useState } from "react";
import { Helmet } from "react-helmet";
import {FaBookOpen,FaOm,FaHeart,FaUsers,FaExclamationTriangle,FaHandsHelping,FaListOl,FaArrowDown} from "react-icons/fa";
import EbookDownload from "./Ebookdownload";
import "../styleSheets/Ebook.css";

const EBook = () => {
  const [openDownload, setOpenDownload] = useState(false);

  return (
    <div className="ebook-page">
      <Helmet>
        <title>The Complete Guide to Spiritual Marriage | Devotee Matchmaking in India</title>
        <meta
          name="description"
          content="A premium guide for individuals and parents seeking spiritually aligned life partners through value-based matrimony."
        />
      </Helmet>

      <article className="ebook-article">
        {/* ===== HERO SECTION ===== */}
        <div className="ebook-hero">
          <h1>
            <FaBookOpen className="ebook-icon main" />
            The Complete Guide to Spiritual Marriage
          </h1>

          <h3 className="ebook-subtitle">
            Devotee Matchmaking in India
          </h3>

          <p className="ebook-tagline">
            A premium guide for individuals and parents seeking spiritually aligned life partners
            through value-based matrimony.
          </p>

          {/* ✅ SINGLE PRIMARY CTA */}
          <button
            className="ebook-download-btn"
            onClick={() => setOpenDownload(true)}
          >
            <FaArrowDown /> Download Free E-Book
          </button>
        </div>

        {/* ===== CONTENT ===== */}
        <h2><FaOm className="ebook-icon" /> Introduction</h2>
        <p>
          Marriage is one of the most sacred and life-defining decisions. For spiritually inclined
          individuals and families, it is not only about compatibility in lifestyle but alignment
          in beliefs, discipline, and purpose.
        </p>

        <h2><FaHeart className="ebook-icon" /> Chapter 1: What Is Spiritual Marriage?</h2>
        <p>
          Spiritual marriage is a union built on shared values, beliefs, and conscious living.
          It emphasizes inner growth, discipline, and mutual respect over superficial parameters.
        </p>

        <div className="highlight">
          Values • Discipline • Purpose • Harmony
        </div>

        <h2><FaHeart className="ebook-icon" /> Chapter 2: Why Spiritual Compatibility Matters</h2>
        <p>
          Many marriages struggle not due to lack of love but because of mismatched values
          and beliefs. Shared spirituality creates peace, patience, and purpose.
        </p>

        <h2><FaUsers className="ebook-icon" /> Chapter 3: Spiritual Paths in Indian Matrimony</h2>
        <p>
          India is home to diverse spiritual traditions such as ISKCON, Isha Foundation,
          Gaudiya Vaishnavism, Shaivism, and Shaktism.
        </p>

        <h2><FaExclamationTriangle className="ebook-icon warning" /> Chapter 4: Common Mistakes in Matchmaking</h2>
        <p>
          Prioritizing income, appearance, or caste over values and rushing decisions
          due to social pressure often leads to regret.
        </p>

        <h2><FaUsers className="ebook-icon" /> Chapter 5: Role of Parents</h2>
        <p>
          Parents should evaluate discipline, habits, and family culture.
          Joint decisions lead to confident and peaceful marriages.
        </p>

        <h2><FaHandsHelping className="ebook-icon" /> Chapter 6: How Vivah Jeevan Helps</h2>
        <p>
          Vivah Jeevan is built specifically for spiritual matrimony in India with
          sect-based filters, simplicity, and affordability.
        </p>

        <h2><FaListOl className="ebook-icon" /> Chapter 7: Step-by-Step Guide</h2>
        <ol>
          <li>Clearly define spiritual values</li>
          <li>Choose a dedicated platform</li>
          <li>Create an honest profile</li>
          <li>Communicate expectations</li>
          <li>Involve family early</li>
          <li>Take time before commitment</li>
        </ol>

        <h2>Your Next Step</h2>
        <p>
          When spirituality aligns, marriage becomes a journey of peace, growth, and
          shared purpose.
        </p>
      </article>

      {openDownload && (
        <EbookDownload onSuccess={() => setOpenDownload(false)} />
      )}
    </div>
  );
};

export default EBook;
