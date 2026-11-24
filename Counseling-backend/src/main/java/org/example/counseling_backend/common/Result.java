package org.example.counseling_backend.common;

import lombok.Data;

@Data
public class Result<T> {
  private String code;
  private String msg;
  private T data;

  public static <T> Result<T> ok() {
    Result<T> result = new Result<>();
    result.setCode("200");
    result.setMsg("success");
    return result;
  }
}
