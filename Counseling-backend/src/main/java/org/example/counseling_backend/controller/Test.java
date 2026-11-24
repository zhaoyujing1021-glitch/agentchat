package org.example.counseling_backend.controller;
import org.example.counseling_backend.common.Result;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Test {
  @GetMapping("/test")
  public Result<String> test() {
    return Result.ok();
  }
}