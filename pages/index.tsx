import AnagramSorter from '../components/AnagramSorter'
import styled from 'styled-components'
import ReceiptInsights from '../components/ReceiptInsights'

const AppContainer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`

export default function Index() {
    return (
        <AppContainer>
            <AnagramSorter />
            <ReceiptInsights />
        </AppContainer>
    )
}
