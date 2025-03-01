import styled from 'styled-components/native';

// O alternativamente si usas emotion:
// import styled from '@emotion/native';

// Define color constants
const green = '#00BFA6';
const red = '#FF0000';

export const MsgBox = styled.Text`
    text-align: center;
    font-size: 13px;
    color: ${props => props.type == 'SUCCESS' ? green : red};
`