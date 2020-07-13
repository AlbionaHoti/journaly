import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import theme from '../../theme'

type Props = {
  currentPage: number
  total: number
  numPerPage?: number
}

const DEFAULT_NUM_PER_PAGE = 4

const Pagination: React.FC<Props> = ({ currentPage, total, numPerPage = DEFAULT_NUM_PER_PAGE }) => {
  const pages = Math.ceil(total / numPerPage)
  let pageTitle = 'My Feed'

  if (pages > 0) {
    pageTitle = `My Feed | Page ${currentPage} of ${pages}`
  }

  const adjacentPageUrl = (direction: 1 | -1) => {
    return {
      pathname: '/dashboard/my-feed',
      query: { page: currentPage + direction },
    }
  }

  return (
    <div className="pagination-wrapper">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Link href={adjacentPageUrl(-1)}>
        <a className="adjacent-page-link" aria-disabled={currentPage <= 1}>
          &larr; Prev
        </a>
      </Link>
      <p>
        Page {currentPage} of {pages}
      </p>
      <Link href={adjacentPageUrl(1)}>
        <a className="adjacent-page-link" aria-disabled={currentPage >= pages}>
          Next &rarr;
        </a>
      </Link>

      <style jsx>{`
        .pagination-wrapper {
          display: inline-grid;
          grid-template-columns: repeat(4, auto);
          align-items: stretch;
          justify-content: center;
          align-content: center;
          border: 1px solid #e1e1e1;
          border-radius: 10px;
          text-align: center;
        }

        .pagination-wrapper > * {
          margin: 0;
          padding: 15px 30px;
          border-right: 1px solid #e1e1e1;
        }

        .pagination-wrapper > *:last-child {
          border-right: 0;
        }

        .pagination-wrapper a[aria-disabled='true'] {
          color: #808080;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

export default Pagination
