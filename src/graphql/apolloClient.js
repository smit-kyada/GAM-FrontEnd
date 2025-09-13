import { useMemo } from "react";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { persistCache } from "apollo-cache-persist";
import { onError } from "@apollo/client/link/error";
import { ApolloLink, split } from '@apollo/client';
import { getMainDefinition } from "apollo-utilities";

// import { createBrowserHistory } from 'history';
// import { WebSocketLink } from "@apollo/client/link/ws";


if (typeof window !== 'undefined') {
    try {
        // See above for additional options, including other storage providers.
        persistCache({
            cache: new InMemoryCache(),
            storage: window.localStorage,
        });
    } catch (error) {
        console.error('Error restoring Apollo cache', error);
    }
}
let apolloClient;

const signOut = () => {
    window.localStorage.clear();
    sessionStorage.clear();
    createBrowserHistory().push('/')
    history.push('/')
    window.location.href = "/" // redirect user to login page
};

function client() {
    const httpLink = createHttpLink({
        uri: process.env.NEXT_PUBLIC_GQL_URL,
    });

    // const wsLink = new WebSocketLink({
    //     // local
    //     uri: `${process.env.NEXT_PUBLIC_SOCKET_URL}`,
    //     // dev
    //     // uri: "wss://dev-api.tykr.com/graphql",
    //     // prod
    //     // uri: "wss://api.tykr.com/graphql",
    //     options: {
    //         reconnect: true,
    //         connectionParams: {
    //             authentication: window.localStorage?.getItem('token'),
    //         },
    //     },
    // });

    const terminatingLink = split(
        ({ query }) => {
            const { kind, operation } = getMainDefinition(query);

            return kind === "OperationDefinition";
        },

        // wsLink,
        httpLink,
    );



    const authLink = setContext((_, { headers = {} }) => {
        let token

        // get the authentication token from local storage if it exists

        if (typeof window !== 'undefined') {
            token = window.localStorage?.getItem('accessToken');
        }
        if (token) {
            headers = { ...headers, "x-token": token };
        }

        return { headers };
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
        // console.log("🚀 ~ file: apolloClient.js:96 ~ errorLink ~ graphQLErrors:", graphQLErrors)
        const loginUser = typeof window !== 'undefined' && JSON.parse(window.localStorage.getItem("user"))
        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, extensions, path }) => {
                if (extensions.code === 'UNAUTHENTICATED') {
                    if (loginUser?.role) {
                        signOut(client)
                        toast.error(message);
                    }
                }
            });
        }

        if (networkError) {
            if (networkError.statusCode === 400) {
                if (loginUser?.role) {
                    signOut(client);
                }
            }
        }
    });

    return new ApolloClient({
        ssrMode: typeof window === "undefined", // set to true for SSR
        link: ApolloLink.from([authLink, errorLink, terminatingLink]),
        cache: new InMemoryCache(),
    });
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? client();

    // If your page has Next.js data fetching methods that use Apollo Client,
    // the initial state gets hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract();

        // Restore the cache using the data passed from
        // getStaticProps/getServerSideProps combined with the existing cached data
        _apolloClient.cache.restore({ ...existingCache, ...initialState });
    }

    // For SSG and SSR always create a new Apollo Client
    if (typeof window === "undefined") return _apolloClient;

    // Create the Apollo Client once in the client

    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export function useApollo(initialState) {
    const store = useMemo(() => initializeApollo(initialState), [initialState]);

    return store;
}
