import * as React from 'react';
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, buildIndexName } from '../../../utils/indexer/consts';
import { algoliasearch } from 'algoliasearch';
import { getAlgoliaResults } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';
import BaseAutoComplete from './BaseAutoComplete';

// Initialize search client only if credentials are available
const searchClient = ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY 
    ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY)
    : null;

export default function AutoCompletePosts() {
    // If Algolia credentials are not configured, render a disabled search box
    if (!searchClient) {
        return (
            <div className="aa-Autocomplete" role="combobox">
                <div className="aa-Input">
                    <input 
                        className="aa-InputField" 
                        placeholder="Search in posts..." 
                        disabled
                        title="Search is not configured"
                    />
                </div>
            </div>
        );
    }

    return (
        <BaseAutoComplete
            openOnFocus={true}
            placeholder="Search in posts..."
            getSources={({ query }) => [
                {
                    sourceId: 'posts',
                    getItems() {
                        return getAlgoliaResults({
                            searchClient,
                            queries: [
                                {
                                    indexName: buildIndexName(),
                                    query
                                }
                            ]
                        });
                    },
                    templates: {
                        item({ item, components }) {
                            return <ResultItem hit={item} components={components} />;
                        }
                    }
                }
            ]}
        />
    );
}

export function ResultItem({ hit, components }) {
    return (
        <a href={hit.url} className="aa-ItemLink">
            <div className="aa-ItemContent">
                <div className="aa-ItemTitle">
                    <components.Highlight hit={hit} attribute="title" />
                </div>
            </div>
        </a>
    );
}
