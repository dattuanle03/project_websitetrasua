import styled from "styled-components";

export const StyledButtonSearchWrapper = styled.div`
  width: 100%;

  .ant-input-group-wrapper {
    width: 100%;
  }

  @media (max-width: 768px) {
    .ant-input {
      font-size: 13px;
      padding: 4px 8px;
    }

    .ant-btn {
      font-size: 13px;
      padding: 4px 10px;
    }

    .ant-input-group-addon {
      padding: 0 4px;
    }
  }
`;
